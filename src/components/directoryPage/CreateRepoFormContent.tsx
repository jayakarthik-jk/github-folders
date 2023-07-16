import { type FC, useEffect, useState } from "react";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import GithubApi from "@/lib/githubApi";
import Supabase from "@/lib/supabase";
import { useUser } from "@/context/UserContext";

interface RepoFormContentProps {
  path: string[];
  closeModel: () => void;
  addToList: (item: FolderRepo) => void;
}
const CreateRepoFormContent: FC<RepoFormContentProps> = ({
  closeModel,
  path,
  addToList,
}) => {
  const [repositories, setRepositories] = useState<Repositories>({
    totalCount: 0,
    nodes: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useUser();

  useEffect(() => {
    const fetchRepos = async (): Promise<void> => {
      setLoading(true);
      const res = await GithubApi.getMyRepo();
      if (res instanceof Error) {
        setError(
          "User not authenticated, if you are authenticated please try logging out and logging in again"
        );
        setLoading(false);
        return;
      }
      setRepositories(res);
      setLoading(false);
    };
    fetchRepos().catch(() => {
      setError("Something went wrong, please try again later");
      setLoading(false);
    });
  }, []);
  const handleRepoSelect = async (repo: Repository): Promise<void> => {
    setLoading(true);
    if (user == null || user.user_metadata.user_name == null) {
      setError("Something went wrong, please try logging in again");
      setLoading(false);
      return;
    }
    const userName = user.user_metadata.user_name;
    let folderId = null;
    if (path.length > 0) {
      const id = +path[path.length - 1];
      if (Number.isNaN(id)) {
        setError("invalid folder id in path");
      }
      folderId = id;
    }

    const pathString = path.length > 0 ? path.join("/") : null;

    const result = await Supabase.createRepo({
      repoName: repo.name,
      userId: user.id,
      userName,
      folderId,
      path: pathString,
    });

    if (result instanceof Error) {
      setError(result.message);
      setLoading(false);
      return;
    }

    addToList(result);
    setLoading(false);
    setError("");
    closeModel();
  };

  if (error !== "") {
    return <span className="text-red-500">{error}</span>;
  }

  if (loading) {
    return (
      <span className="p-16 flex flex-col gap-4 font-bold text-lg">
        Loading . . .
        <Spinner />
      </span>
    );
  }
  return (
    <>
      <span className="font-bold text-lg">Select from the list</span>
      <ul className="max-h-[50vh] overflow-y-scroll">
        {repositories.nodes.map((repo) => (
          <li
            key={repo.id}
            className="hover:bg-dark-200 p-4 flex justify-between rounded-lg"
          >
            {repo.name}
            <Button
              onClick={() => {
                handleRepoSelect(repo).catch(() => {
                  setError("Something went wrong, please try again later");
                  setLoading(false);
                });
              }}
            >
              Select
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default CreateRepoFormContent;
