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
import Button from "@/components/common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import useDeviceType from "@/hooks/useDeviceType";

export interface UserPageProps {
  path: string[];
  username: string;
  currentFolderName: string | null;
  data: FolderRepo[];
}

const UserPage: FC<UserPageProps> = ({ data: folderRepos, path, username }) => {
  const [searchbarVisibility, setSearchbarVisibility] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 30;
  const [sortOrder, setSortOrder] = useState<SortOptions>("asc");

  const [selected, setSelected] = useState<FolderRepo[]>([]);

  const filtered = filter(
    folderRepos.map((fr) => ({
      ...fr,
      title: isFolderType(fr) ? fr.folder_name : fr.repo_name,
    })),
    searchQuery
  );
  const sorted = sort(filtered, sortOrder);
  const paginated = paginate(sorted, currentPage, pageSize);
  const { user } = useUser();
  const router = useRouter();
  const device = useDeviceType();

  const handleFolderDoubleClick = (folder: FolderType): void => {
    setSelected([]);
    router.push(`${username}/${folder.path}`).catch((e) => {
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

  const isFolderType = (obj: FolderRepo): obj is FolderType => {
    return "parent_id" in obj;
  };

  return (
    <div className="min-h-full w-full relative">
      {user !== null && user.user_metadata.user_name === username && (
        <>
          <AddNew
            path={path}
            className={selected.length > 0 ? "-bottom-full" : ""}
          />
          <Button
            className={`fixed ${
              selected.length === 1
                ? device === "mobile"
                  ? "bottom-16 right-2"
                  : "bottom-20 right-6"
                : selected.length > 1
                ? device === "mobile"
                  ? "bottom-2 right-2"
                  : "bottom-6 right-6"
                : "bottom-2 -right-full"
            } h-10 w-10 flex justify-center items-center z-10 transition-all duration-300`}
          >
            <FontAwesomeIcon icon={faTrash} size="lg" />
          </Button>
          <Button
            className={`fixed ${
              selected.length === 1
                ? device === "mobile"
                  ? "bottom-2 right-2"
                  : "bottom-6 right-6"
                : "bottom-2 -right-full"
            } h-10 w-10 flex justify-center items-center z-10 transition-all duration-300`}
          >
            <FontAwesomeIcon icon={faPen} size="lg" />
          </Button>
        </>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;

  if (params === undefined) {
    return {
      notFound: true,
    };
  }

  const path = params.path as string[];
  const userName = path.shift() as string;
  const pathString = path.join("/").trim();

  if (path.length === 0) {
    // root folder
    const folders = await Supabase.getRootFolders(userName);

    if (folders === null) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        path,
        username: userName,
        params,
        data: folders,
      },
    };
  }
  const currentFolderName = path[path.length - 1].trim();
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

  const repoFolders: FolderRepo[] = [...folders, ...repos];

  return {
    props: {
      path,
      username: userName,
      currentFolderName,
      params,
      data: repoFolders,
    },
  };
};

export default UserPage;
