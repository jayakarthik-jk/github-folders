import supabase from "@/lib/supabase";
import { Octokit } from "octokit";

interface SearchUserProps {
  query: string;
  perPage: number;
  pageInfo: PageInfo;
}
export const searchUser = async ({
  query = "popular",
  perPage = 10,
  pageInfo,
}: SearchUserProps): Promise<SearchUserResponse["search"] | null> => {
  const session = await supabase.auth.getSession();
  if (session.error !== null || session.data.session === null) return null;
  const octokit = new Octokit({
    auth: session.data.session.provider_token,
  });

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

export const getUserByUsername = async (
  username: string
): Promise<GetUserByIdResponse["data"] | null> => {
  const session = await supabase.auth.getSession();
  if (session.error !== null || session.data.session === null) {
    return null;
  }

  const octokit = new Octokit({
    auth: session.data.session.provider_token,
  });
  const response = await octokit.graphql<GetUserByIdResponse>(
    `
    query ($username: String!) {
      user(login: $username) {
        id
      }
    }
  `,
    {
      username,
    }
  );

  return response.data;
};

interface GetUserByIdResponse {
  data: {
    user: {
      id: string;
    } | null;
  };
  errors?: Array<{
    type: string;
    message: string;
  }>;
}
