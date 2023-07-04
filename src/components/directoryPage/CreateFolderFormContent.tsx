import { useRef, type FC, useState } from "react";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import { useUser } from "@/context/UserContext";
import Supabase from "@/lib/supabase";

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
    setLoading(true);
    if (user == null || user.user_metadata.user_name == null) {
      setError("Something went wrong, please try logging in again");
      return;
    }
    const username = user.user_metadata.user_name;
    const [parentName, pathString] =
      path.length - 1 === 0
        ? [null, folderName]
        : [path[path.length - 1], path.slice(1).join("/") + "/" + folderName];

    const res = await Supabase.createFolder({
      folderName,
      parentName,
      path: pathString,
      username,
    });
    if (res instanceof Error) {
      setError(res.message);
      setLoading(false);
      return;
    }
    // TODO: update the ui
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
        <span className="p-4">
          <Spinner />
        </span>
      )}
    </>
  );
};

export default CreateFolderFormContent;
