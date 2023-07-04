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
    created_at: string | null;
    id: number;
    parent_name: string | null;
    path: string;
    title: string;
    username: string;
  }
  interface RepoType {
    id: number;
    repo_id: string;
    created_at: string | null;
    title: string;
    username: string;
    folder_name: string | null;
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
