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
  static getInstance = async (): Promise<Octokit | null> => {
    const session = await Supabase.getInstance().auth.getSession();
    if (session.error !== null || session.data.session === null) return null;
    if (session.data.session.provider_token == null) {
      const signOutRes = await Supabase.getInstance().auth.signOut();
      if (signOutRes.error !== null) {
        console.log(signOutRes.error);
      }
      return null;
    }

    const instance = new Octokit({
      auth: session.data.session.provider_token,
    });
    GithubApi.session = session.data.session;
    return instance;
  };

  static searchUser = async ({
    query = "popular",
    perPage = 10,
    pageInfo,
  }: SearchUserProps): Promise<SearchUserResponse["search"] | null> => {
    const octokit = await GithubApi.getInstance();
    if (octokit === null) {
      return null;
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

  static getMyRepo = async (): Promise<Repositories | null> => {
    const octokit = await GithubApi.getInstance();
    if (octokit === null) {
      return null;
    }
    const username = this.session?.user.user_metadata.user_name;
    if (username == null) {
      return null;
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
