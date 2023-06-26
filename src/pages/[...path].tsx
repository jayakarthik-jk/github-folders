import { type FC, useState } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import Container from "@/components/common/Container";
import Folder from "@/components/directoryPage/Folder";
import Repo from "@/components/directoryPage/Repo";
import { filter, paginate, sort } from "@/utils/arrays";
import supabase, { Tables } from "@/lib/supabase";
import AddNewButton from "@/components/directoryPage/AddNewButton";
import { useUser } from "@/context/UserContext";

export interface UserPageProps {
  path: string[];
  username: string;
  currentFolderName: string;
  data: FolderRepo[];
}

const UserPage: FC<UserPageProps> = ({ data: folderRepos, path, username }) => {
  const [searchbarVisibility, setSearchbarVisibility] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 30;
  const [sortOrder, setSortOrder] = useState<SortOptions>("asc");

  const [selected, setSelected] = useState<FolderRepo[]>([]);

  const filtered = filter(folderRepos, searchQuery);
  const sorted = sort(filtered, sortOrder);
  const paginated = paginate(sorted, currentPage, pageSize);

  const { user } = useUser();
  const router = useRouter();

  const handleFolderDoubleClick = (folder: FolderType): void => {
    setSelected([]);
    router.push(`${username}/${folder.path}`).catch((e) => {
      console.log(e);
    });
  };

  const handleRepoDoubleClick = (repo: RepoType): void => {
    window.location.href = `https://github.com/${repo.username}/${repo.title}`;
  };

  const handleSingleClick = (folder: FolderRepo): void => {
    if (selected.findIndex((s) => s.id === folder.id) !== -1) {
      setSelected(selected.filter((f) => f.id !== folder.id));
    } else {
      setSelected([folder]);
    }
  };

  return (
    <div className="min-h-full w-full relative">
      {user !== null && user.user_metadata.user_name === username && (
        <AddNewButton path={path} />
      )}

      <Container
        title={path.slice(-1)[0]}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        pageCount={Math.ceil(filtered.length / pageSize)}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        searchBarVisibility={searchbarVisibility}
        setSearchBarVisibility={setSearchbarVisibility}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      >
        {paginated.map((c) =>
          isFolderType(c) ? (
            <Folder
              key={c.id}
              {...c}
              selected={selected.findIndex((s) => s.id === c.id) !== -1}
              onDoubleClick={() => {
                handleFolderDoubleClick(c);
              }}
              onSingleClick={() => {
                handleSingleClick(c);
              }}
            />
          ) : (
            <Repo
              key={c.id}
              {...c}
              selected={selected.findIndex((s) => s.id === c.id) !== -1}
              onDoubleClick={() => {
                handleRepoDoubleClick(c);
              }}
              onSingleClick={() => {
                handleSingleClick(c);
              }}
            />
          )
        )}
      </Container>
    </div>
  );
};

function isFolderType(obj: FolderRepo): obj is FolderType {
  return "parent_name" in obj;
}

const getRootFolders = async (
  username: string
): Promise<FolderType[] | null> => {
  const { data: folders, error: folderError } = await supabase
    .from(Tables.Folder)
    .select("*")
    .eq("username", username)
    .is("parent_name", null)
    .returns<FolderType[]>();
  if (folderError !== null) {
    return null;
  }
  return folders;
};

const getSubFolders = async (
  username: string,
  parentFolderName: string,
  path: string
): Promise<FolderType[] | null> => {
  const { data: folders, error: folderError } = await supabase
    .from(Tables.Folder)
    .select("*")
    .eq("username", username)
    .eq("parent_name", parentFolderName)
    .returns<FolderType[]>();

  if (folderError !== null) {
    return null;
  }
  const result = folders.filter(
    (f) => f.path.split("/").slice(0, -1).join("/") === path
  );

  // if (result.length === 0) {
  //   return null;
  // }

  return result;
};

const getRepos = async (
  username: string,
  folderName: string,
  path: string
): Promise<RepoType[] | null> => {
  const { data: repos, error: repoError } = await supabase
    .from(Tables.Repo)
    .select("*")
    .eq("username", username)
    .eq("folder_name", folderName)
    .eq("path", path)
    .returns<RepoType[]>();

  if (repoError !== null) {
    return null;
  }
  return repos;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;

  if (params === undefined) {
    return {
      notFound: true,
    };
  }
  const path = params.path as string[];
  const pathString = path.slice(1).join("/").trim();
  const username = path[0].trim();
  const currentFolderName = path[path.length - 1].trim();

  if (path.length === 1) {
    // root folder
    const folders = await getRootFolders(username);

    if (folders === null) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        path,
        username,
        currentFolderName,
        params,
        data: folders,
      },
    };
  }
  const folders = await getSubFolders(username, currentFolderName, pathString);

  const repos = await getRepos(username, currentFolderName, pathString);

  if (folders === null || repos === null) {
    return {
      notFound: true,
    };
  }

  const repoFolders: FolderRepo[] = [...folders, ...repos];

  return {
    props: {
      path,
      username,
      currentFolderName,
      params,
      data: repoFolders,
    },
  };
};

export default UserPage;

// TODO: remove this
// const data = [
//   { title: "folder name 1 1" },
//   { title: "folder name 1 2" },
//   { title: "folder name 1 3" },
//   { title: "folder name 1 4" },
//   { title: "folder name 1 5" },
//   { title: "folder name 1 6" },
//   { title: "folder name 1 7" },
//   { title: "folder name 1 8" },
//   { title: "folder name 1 9" },
//   { title: "folder name 1 10" },
//   { title: "folder name 1 11" },
//   { title: "folder name 1 12" },
//   { title: "folder name 1 13" },
//   { title: "folder name 1 14" },
//   { title: "folder name 1 15" },
//   { title: "folder name 1 16" },
//   { title: "folder name 1 17" },
//   { title: "folder name 1 18" },
//   { title: "folder name 1 19" },
//   { title: "folder name 1 20" },
//   { title: "folder name 1 21" },
//   { title: "folder name 1 22" },
//   { title: "folder name 1 23" },
//   { title: "folder name 1 24" },
//   { title: "folder name 1 25" },
//   { title: "folder name 1 26" },
//   { title: "folder name 1 27" },
//   { title: "folder name 1 28" },
//   { title: "folder name 1 29" },
//   { title: "folder name 1 30" },
//   { title: "folder name 2 1" },
//   { title: "folder name 2 2" },
//   { title: "folder name 2 3" },
//   { title: "folder name 2 4" },
//   { title: "folder name 2 5" },
//   { title: "folder name 2 6" },
//   { title: "folder name 2 7" },
//   { title: "folder name 2 8" },
//   { title: "folder name 2 9" },
//   { title: "folder name 2 10" },
//   { title: "folder name 2 11" },
//   { title: "folder name 2 12" },
//   { title: "folder name 2 13" },
//   { title: "folder name 2 14" },
//   { title: "folder name 2 15" },
//   { title: "folder name 2 16" },
//   { title: "folder name 2 17" },
//   { title: "folder name 2 18" },
//   { title: "folder name 2 19" },
//   { title: "folder name 2 20" },
//   { title: "folder name 2 21" },
//   { title: "folder name 2 22" },
//   { title: "folder name 2 23" },
//   { title: "folder name 2 24" },
//   { title: "folder name 2 25" },
//   { title: "folder name 2 26" },
//   { title: "folder name 2 27" },
//   { title: "folder name 2 28" },
//   { title: "folder name 2 29" },
//   { title: "folder name 2 30" },
//   { title: "folder name 3 1" },
//   { title: "folder name 3 2" },
//   { title: "folder name 3 3" },
//   { title: "folder name 3 4" },
//   { title: "folder name 3 5" },
//   { title: "folder name 3 6" },
//   { title: "folder name 3 7" },
//   { title: "folder name 3 8" },
//   { title: "folder name 3 9" },
//   { title: "folder name 3 10" },
//   { title: "folder name 3 11" },
//   { title: "folder name 3 12" },
//   { title: "folder name 3 13" },
//   { title: "folder name 3 14" },
//   { title: "folder name 3 15" },
//   { title: "folder name 3 16" },
//   { title: "folder name 3 17" },
//   { title: "folder name 3 18" },
//   { title: "folder name 3 19" },
//   { title: "folder name 3 20" },
//   { title: "folder name 3 21" },
//   { title: "folder name 3 22" },
//   { title: "folder name 3 23" },
//   { title: "folder name 3 24" },
//   { title: "folder name 3 25" },
//   { title: "folder name 3 26" },
//   { title: "folder name 3 27" },
//   { title: "folder name 3 28" },
//   { title: "folder name 3 29" },
//   { title: "folder name 3 30" },
// ];
