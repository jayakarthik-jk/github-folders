import { type FC, useState, useEffect } from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import Container from "@/components/common/Container";
import Folder from "@/components/directoryPage/Folder";
import Repo from "@/components/directoryPage/Repo";
import { filter, paginate, sort } from "@/utils/arrays";
import Supabase from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import AddNewButton from "@/components/directoryPage/AddNewButton";
import DeleteButton from "@/components/directoryPage/DeleteButton";
import RenameButton from "@/components/directoryPage/RenameButton";

export interface UserPageProps {
  data: FolderRepo[];
  path: string[];
  userName: string;
}

const UserPage: FC<UserPageProps> = ({ data, path, userName }) => {
  const [folderRepos, setFolderRepos] = useState<FolderRepo[]>(data);
  const [searchbarVisibility, setSearchbarVisibility] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 30;
  const [sortOrder, setSortOrder] = useState<SortOptions>("asc");
  const [selected, setSelected] = useState<FolderRepo[]>([]);

  useEffect(() => {
    setFolderRepos(data);
  }, [data]);

  const removeFromList = (ids: number[]): void => {
    setFolderRepos((prevList) =>
      prevList.filter((item) => !ids.includes(item.id))
    );
  };

  const addToList = (item: FolderRepo): void => {
    setFolderRepos((prevList) => [...prevList, item]);
  };

  const renameListItem = (id: number, name: string, path: string): void => {
    setFolderRepos((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, folder_name: name, path } : item
      )
    );
  };

  const filtered = filter(
    folderRepos.map((fr) => ({
      ...fr,
      title: Supabase.isFolderType(fr) ? fr.folder_name : fr.repo_name,
    })),
    searchQuery
  );

  const sorted = sort(filtered, sortOrder);
  const paginated = paginate(sorted, currentPage, pageSize);
  const { user } = useUser();
  const router = useRouter();

  const handleFolderDoubleClick = (folder: FolderType): void => {
    setSelected([]);
    router.push(`${userName}/${folder.path}`).catch((e) => {
      console.log(e);
    });
  };

  const handleRepoDoubleClick = (repo: RepoType): void => {
    window.location.href = `https://github.com/${repo.user_name}/${repo.repo_name}`;
  };

  const handleSingleClick = (folder: FolderRepo, e: React.MouseEvent): void => {
    if (selected.findIndex((s) => s.id === folder.id) !== -1) {
      if (e.ctrlKey || e.metaKey) {
        setSelected(selected.filter((f) => f.id !== folder.id));
      } else {
        setSelected([]);
      }
    } else {
      if (e.ctrlKey || e.metaKey) {
        setSelected([...selected, folder]);
      } else {
        setSelected([folder]);
      }
    }
  };

  return (
    <div className="min-h-full w-full relative">
      {user !== null && user.user_metadata.user_name === userName && (
        <>
          <AddNewButton
            path={path}
            className={selected.length > 0 ? "-bottom-full" : ""}
            addToList={addToList}
          />
          <DeleteButton
            selected={selected}
            removeFromList={removeFromList}
            setSelected={setSelected}
          />
          <RenameButton selected={selected} renameListItem={renameListItem} />
        </>
      )}
      <Container
        title={path[path.length - 1]}
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
          Supabase.isFolderType(c) ? (
            <Folder
              key={c.id}
              {...c}
              selected={selected.findIndex((s) => s.id === c.id) !== -1}
              onDoubleClick={() => {
                handleFolderDoubleClick(c);
              }}
              onSingleClick={(e) => {
                handleSingleClick(c, e);
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
              onSingleClick={(e) => {
                handleSingleClick(c, e);
              }}
            />
          )
        )}
      </Container>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (params === undefined) {
    return {
      notFound: true,
    };
  }

  const path = params.path as string[];
  const userName = path[0];
  const pathString = path.slice(1).join("/").trim();

  if (path.length === 1) {
    // root folders and repos
    const folderRepos = await Supabase.getRootFolderRepos(userName);

    if (folderRepos === null) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        data: folderRepos,
        userName,
        path,
      },
    };
  }
  const folderId = await Supabase.getFolderId(userName, pathString);
  if (folderId instanceof Error) {
    return {
      notFound: true,
    };
  }
  const folders = await Supabase.getSubFolders({
    parentId: folderId,
    userName,
    path: pathString,
  });

  const repos = await Supabase.getRepos({
    folderId,
    userName,
    path: pathString,
  });

  if (folders === null || repos === null) {
    return {
      notFound: true,
    };
  }

  const foldersAndRepos: FolderRepo[] = [...folders, ...repos];

  return {
    props: {
      data: foldersAndRepos,
      userName,
      path,
    },
  };
};

export default UserPage;
