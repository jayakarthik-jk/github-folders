import { type FC, useEffect, useState } from "react";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import GithubApi from "@/lib/githubApi";
import Supabase from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/router";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useUser();
  const router = useRouter();

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
      <span className="p-16 flex flex-col gap-4 font-bold text-lg">
        Loading . . .
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
    const userName = user.user_metadata.user_name;

    // TODO replace path[path.length - 1]
    let folderId = null;
    if (path.length - 1 !== 0) {
      const responseParentId = await Supabase.getFolderId(
        userName,
        path.join("/")
      );
      if (responseParentId instanceof Error) {
        setError("Something went wrong, please try again later");
        setLoading(false);
        return;
      }
      folderId = responseParentId;
    }

    const pathString =
      path.length - 1 === 0
        ? repo.name
        : path.slice(1).join("/") + "/" + repo.name;

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

    router.reload();
    setLoading(false);
    setError("");
    closeModel();
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
