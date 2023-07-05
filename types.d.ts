import { type JSXElementConstructor, type ReactElement } from "react";

declare global {
  type ApiHandler = (
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextApiHandler
  ) => Promise<void>;

  type InputComponent = ReactElement<
    ContainerChildProps,
    string | JSXElementConstructor<any>
  >;

  type SortOptions = "asc" | "desc";

  interface SearchUser {
    login: string;
    avatarUrl: string;
  }

  interface PageInfo {
    endCursor: string;
    startCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }

  interface SearchUserResponse {
    search: {
      nodes: SearchUser[];
      userCount: number;
      pageInfo: PageInfo;
    };
  }

  interface FolderType {
    id: number;
    user_id: string;
    user_name: string;
    folder_name: string;
    parent_id: number | null;
    path: string;
    created_at: string;
  }

  interface RepoType {
    id: number;
    repo_name: string;
    user_id: string;
    user_name: string;
    folder_id: number | null;
    path: string;
    created_at: string;
  }

  type FolderRepo = FolderType | RepoType;

  interface Repository {
    id: string;
    name: string;
  }

  interface Repositories {
    totalCount: number;
    nodes: Repository[];
  }

  interface RepositoriesResponse {
    user: {
      repositories: Repositories;
    };
  }
}
