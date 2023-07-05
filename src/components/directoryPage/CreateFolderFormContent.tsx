import { useRef, type FC, useState } from "react";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import { useUser } from "@/context/UserContext";
import Supabase from "@/lib/supabase";
import { useRouter } from "next/router";

interface FolderFormContentProps {
  path: string[];
  closeModel: () => void;
}

const CreateFolderFormContent: FC<FolderFormContentProps> = ({
  closeModel,
  path,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useUser();
  const router = useRouter();

  const handleCreateFolder = async (): Promise<void> => {
    if (inputRef.current == null) {
      console.log("developer error: cannot find input ref");
      setError("Something went wrong, please try again later");
      return;
    }
    const folderName = inputRef.current.value.trim();
    if (folderName === "") {
      setError("Folder name cannot be empty");
      return;
    }

    if (user == null || user.user_metadata.user_name == null) {
      setError("Something went wrong, please try logging in again");
      return;
    }
    setError("");
    setLoading(true);

    const userName = user.user_metadata.user_name;
    const userId = user.id;
    let parentId = null;

    if (path.length !== 0) {
      const responseParentId = await Supabase.getFolderId(
        userName,
        path.slice(1).join("/")
      );

      if (responseParentId instanceof Error) {
        setError("Something went wrong, please try again later");
        setLoading(false);
        return;
      }
      parentId = responseParentId;
    }
    const pathString =
      path.length === 0
        ? folderName
        : path.slice(1).join("/") + "/" + folderName;

    const res = await Supabase.createFolder({
      userId,
      userName,
      folderName,
      parentId,
      path: pathString,
    });
    if (res instanceof Error) {
      setError(res.message);
      setLoading(false);
      return;
    }
    await router.push(`${path.join("/")}/${folderName}`);
    setError("");
    setLoading(false);
    closeModel();
  };
  return (
    <>
      <span className="font-bold">New Folder</span>
      <div className="flex justify-center items-center gap-4">
        <label htmlFor="fname" className="text-lg">
          Folder name
        </label>
        <input
          type="text"
          placeholder="Enter here"
          id="fname"
          name="fname"
          className="p-2 rounded-lg border-2 focus:border-primary-300 focus:outline-none text-black disabled:cursor-not-allowed disabled:bg-gray-200"
          ref={inputRef}
          disabled={loading}
        />
      </div>
      <Button
        className="bg-dark-300"
        onClick={() => {
          handleCreateFolder().catch((err) => {
            setError("Something went wrong, please try again later");
            console.log(err);
          });
        }}
        disabled={loading}
      >
        Create
      </Button>
      {error !== "" && <span className="text-red-500">{error}</span>}
      {loading && (
        <span className="p-4 flex flex-col gap-4 font-bold text-lg">
          Loading . . .
          <Spinner />
        </span>
      )}
    </>
  );
};

export default CreateFolderFormContent;
