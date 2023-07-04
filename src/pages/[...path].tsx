import { type FC, useState } from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import Container from "@/components/common/Container";
import Folder from "@/components/directoryPage/Folder";
import Repo from "@/components/directoryPage/Repo";
import { filter, paginate, sort } from "@/utils/arrays";
import Supabase from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import AddNew from "@/components/directoryPage/AddNewButton";

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

  const isFolderType = (obj: FolderRepo): obj is FolderType => {
    return "parent_name" in obj;
  };

  return (
    <div className="min-h-full w-full relative">
      {user !== null && user.user_metadata.user_name === username && (
        <AddNew path={path} />
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
    const folders = await Supabase.getRootFolders(username);
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
  const folders = await Supabase.getSubFolders(
    username,
    currentFolderName,
    pathString
  );

  const repos = await Supabase.getRepos(
    username,
    currentFolderName,
    pathString
  );

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
