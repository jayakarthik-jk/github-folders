import { type FC, useState } from "react";
import Button from "../common/Button";
import Spinner from "../common/Spinner";
import { useUser } from "@/context/UserContext";
import Supabase from "@/lib/supabase";

interface FolderFormContentProps {
  path: string[];
  closeModel: () => void;
  addToList: (item: FolderRepo) => void;
}

const CreateFolderFormContent: FC<FolderFormContentProps> = ({
  closeModel,
  path,
  addToList,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useUser();
  const [folderNameInput, setFolderNameInput] = useState("");

  const handleCreateFolder = async (): Promise<void> => {
    const folderName = folderNameInput.trim();
    if (folderName.trim() === "") {
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

    if (path.length > 1) {
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
      path.length > 1 ? path.slice(1).join("/") + "/" + folderName : folderName;

    const result = await Supabase.createFolder({
      userId,
      userName,
      folderName,
      parentId,
      path: pathString,
    });
    if (result instanceof Error) {
      setError(result.message);
      setLoading(false);
      return;
    }

    addToList(result);
    setError("");
    setLoading(false);
    setFolderNameInput("");
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
          disabled={loading}
          value={folderNameInput}
          onChange={(e) => {
            setFolderNameInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreateFolder().catch(() => {
                setError("Something went wrong, please try again later");
              });
            }
          }}
        />
      </div>
      <Button
        className="bg-dark-300"
        onClick={() => {
          handleCreateFolder().catch(() => {
            setError("Something went wrong, please try again later");
            setLoading(false);
          });
        }}
        disabled={loading}
      >
        Create
      </Button>
      {error !== "" && <span className="text-red-500">{error}</span>}
      {loading && (
        <span className="p-4 flex flex-col gap-4 font-bold text-lg">
          Creating Folder . . .
          <Spinner />
        </span>
      )}
    </>
  );
};

export default CreateFolderFormContent;
