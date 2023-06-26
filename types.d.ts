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
    created_at: string;
    title: string;
    parent_name: string | null;
    username: string;
    path: string;
  }
  interface RepoType {
    id: number;
    created_at: string;
    title: string;
    username: string;
    folder_name: string;
  }

  type FolderRepo = FolderType | RepoType;
}
