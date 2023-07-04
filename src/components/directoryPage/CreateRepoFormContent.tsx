import { type FC, useEffect, useState } from "react";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import GithubApi from "@/lib/githubApi";
import Supabase from "@/lib/supabase";
import { useUser } from "@/context/UserContext";

interface RepoFormContentProps {
  path: string[];
  closeModel: () => void;
}
const CreateRepoFormContent: FC<RepoFormContentProps> = ({
  closeModel,
  path,
}) => {
  const [repositories, setRepositories] = useState<Repositories>({
    totalCount: 0,
    nodes: [],
  });
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRepos = async (): Promise<void> => {
      setLoading(true);
      const res = await GithubApi.getMyRepo();
      if (res == null) {
        setError(
          "User not authenticated, if you are authenticated please try logging out and logging in again"
        );
        setLoading(false);
        return;
      }
      setRepositories(res);
      setLoading(false);
    };
    fetchRepos().catch((err) => {
      setError("Something went wrong, please try again later");
      setLoading(false);
      console.log(err);
    });
  }, []);

  if (error !== "") {
    return <span className="text-red-500">{error}</span>;
  }

  if (loading) {
    return (
      <span className="p-16">
        <Spinner />
      </span>
    );
  }
  const handleRepoSelect = async (repo: Repository): Promise<void> => {
    setLoading(true);
    if (user == null || user.user_metadata.user_name == null) {
      setError("Something went wrong, please try logging in again");
      setLoading(false);
      return;
    }
    const username = user.user_metadata.user_name;

    const [folderName, pathString] =
      path.length - 1 === 0
        ? [null, repo.name]
        : [path[path.length - 1], path.slice(1).join("/") + "/" + repo.name];

    const result = await Supabase.createRepo({
      repoName: repo.name,
      repoId: repo.id,
      username,
      folderName,
      path: pathString,
    });

    if (result instanceof Error) {
      setError(result.message);
      setLoading(false);

      return;
    }
    setLoading(false);
    closeModel();
    // TODO: update the ui
  };
  return (
    <ul className="max-h-[50vh] overflow-y-scroll">
      {repositories.nodes.map((repo) => (
        <li
          key={repo.id}
          className="hover:bg-dark-200 p-4 flex justify-between rounded-lg"
        >
          {repo.name}
          <Button
            onClick={() => {
              handleRepoSelect(repo).catch((err) => {
                setError("Something went wrong, please try again later");
                console.log(err);
              });
            }}
          >
            Select
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default CreateRepoFormContent;
