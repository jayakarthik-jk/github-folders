import Supabase from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { Octokit } from "octokit";

interface SearchUserProps {
  query: string;
  perPage: number;
  pageInfo: PageInfo;
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class GithubApi {
  static session: Session | null = null;
  static getInstance = async (): Promise<Octokit | Error> => {
    const sessionResponse = await Supabase.getInstance().auth.getSession();
    if (
      sessionResponse.error !== null ||
      sessionResponse.data.session === null
    ) {
      return new Error("login");
    }
    let session = sessionResponse.data.session;
    if (session.provider_token == null) {
      const response = await Supabase.getInstance().auth.refreshSession(
        session
      );
      if (response.error !== null || response.data.session === null) {
        return new Error("login");
      }
      session = response.data.session;
    }

    const instance = new Octokit({
      auth: session.provider_token,
    });
    GithubApi.session = session;
    return instance;
  };

  static searchUser = async ({
    query = "popular",
    perPage = 10,
    pageInfo,
  }: SearchUserProps): Promise<SearchUserResponse["search"] | Error> => {
    const octokit = await GithubApi.getInstance();
    if (octokit instanceof Error) {
      return octokit;
    }
    const response = await octokit.graphql<SearchUserResponse>(
      `
      query ($q: String!, $perPage: Int!, $after: String, $before: String) {
        search(query: $q, type: USER, first: $perPage, after: $after, before: $before) {
          nodes {
            ... on User {
              login
              avatarUrl
            }
          }
          userCount
          pageInfo {
            endCursor
            startCursor
            hasNextPage
            hasPreviousPage
          }
        }
      }
    `,
      {
        q: query,
        perPage,
        after: pageInfo.startCursor !== "" ? pageInfo.startCursor : null,
        before: pageInfo.endCursor !== "" ? pageInfo.endCursor : null,
      }
    );
    response.search.nodes = response.search.nodes.filter(
      (node) =>
        node != null &&
        Object.hasOwn(node, "login") &&
        Object.hasOwn(node, "avatarUrl")
    );
    return response.search;
  };

  static getMyRepo = async (): Promise<Repositories | Error> => {
    const octokit = await GithubApi.getInstance();
    if (octokit instanceof Error) {
      return octokit;
    }
    const username = this.session?.user?.user_metadata?.user_name;
    if (username == null) {
      return new Error("login");
    }
    const response = await octokit.graphql<RepositoriesResponse>(
      `
      query ($username: String!) {
        user(login: $username) {
          repositories(first: 100, privacy: PUBLIC, orderBy: {field: UPDATED_AT, direction: DESC}) {
            totalCount
            nodes {
              id
              name
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
      
    `,
      {
        username,
      }
    );

    return response.user.repositories;
  };
}
