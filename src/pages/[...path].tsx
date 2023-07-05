import { type FC, useState } from "react";
import type { GetServerSideProps } from "next";
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

const UserPage: FC<UserPageProps> = ({ data: folderRepos, path, userName }) => {
  const [searchbarVisibility, setSearchbarVisibility] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 30;
  const [sortOrder, setSortOrder] = useState<SortOptions>("asc");
  const [selected, setSelected] = useState<FolderRepo[]>([]);

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
          />
          <DeleteButton selected={selected} />
          <RenameButton selected={selected} />
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (params === undefined) {
    return {
      notFound: true,
    };
  }

  const path = params.path as string[];
  const userName = path[0];
  const pathString = path.slice(1).join("/").trim();

  if (path.length === 1) {
    // root folder
    const folders = await Supabase.getRootFolders(userName);

    if (folders === null) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        data: folders,
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
