import { useState, type FC } from "react";
import Button from "../common/Button";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useDeviceType from "@/hooks/useDeviceType";
import Supabase from "@/lib/supabase";
import Model from "../common/Model";
import Spinner from "../common/Spinner";
import { useUser } from "@/context/UserContext";

interface RenameButtonProps {
  selected: FolderRepo[];
  renameListItem: (id: number, name: string, path: string) => void;
}

const RenameButton: FC<RenameButtonProps> = ({ selected, renameListItem }) => {
  const device = useDeviceType();
  const [newFolderNameInput, setNewFolderNameInput] = useState("");
  const [modelVisibility, setModelVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useUser();

  const handleRenaming = async (): Promise<void> => {
    const newName = newFolderNameInput.trim();
    if (newName === undefined) {
      console.log("developer error: cannot find input ref");
      setError("something went wrong, try again later");
      return;
    }
    if (newName === "") {
      setError("Folder name cannot be empty");
      return;
    }
    if (user == null || user.user_metadata.user_name == null) {
      setError("Something went wrong, please try logging in again");
      return;
    }
    const userName = user.user_metadata.user_name;
    const userId = user.id;

    setLoading(true);
    setError("");
    const newPath = [...selected[0].path.split("/").slice(0, -1), newName].join(
      "/"
    );

    const res = await Supabase.renameFolder({
      folder: selected[0] as FolderType,
      newName,
      newPath,
      userId,
      userName,
    });
    setLoading(false);
    if (res instanceof Error) {
      setError(res.message);
      return;
    }
    renameListItem(selected[0].id, newName, newPath);
    setNewFolderNameInput("");
    setModelVisibility(false);
  };
  return (
    <>
      <Button
        className={`fixed ${
          selected.length === 1 && Supabase.isFolderType(selected[0])
            ? device === "mobile"
              ? "bottom-2 right-2"
              : "bottom-6 right-6"
            : "bottom-2 -right-full"
        } h-10 w-10 flex justify-center items-center z-10 transition-all duration-300`}
        onClick={() => {
          setNewFolderNameInput((selected[0] as FolderType).folder_name);
          setModelVisibility(true);
        }}
      >
        <FontAwesomeIcon icon={faPen} size="lg" />
      </Button>
      <Model
        onClose={() => {
          setModelVisibility(false);
        }}
        className={modelVisibility ? "scale-100" : "scale-0"}
      >
        <div className="flex flex-col gap-4 p-4">
          <span className="font-bold text-lg">Folder&apos;s new name</span>
          <input
            type="text"
            className="p-2 w-64 rounded-lg border-2 focus:border-primary-300 focus:outline-none text-black disabled:cursor-not-allowed disabled:bg-gray-200"
            placeholder="Enter here"
            name="foldername"
            disabled={loading}
            value={newFolderNameInput}
            onChange={(e) => {
              setNewFolderNameInput(e.target.value);
            }}
            // enter key to submit
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRenaming().catch((err) => {
                  console.log(err);
                  setError("Something went wrong, try again later");
                });
              }
            }}
          />
          <div className="flex justify-end">
            <Button
              className="bg-dark-300 disabled:opacity-40"
              onClick={handleRenaming}
              disabled={loading}
            >
              Rename
            </Button>
          </div>
          {loading && (
            <span className="p-4 flex flex-col gap-4 font-bold text-lg">
              Renaming . . .
              <Spinner />
            </span>
          )}
          {error !== "" && (
            <div className="flex justify-center items-center text-lg font-bold text-red-500">
              {error}
            </div>
          )}
        </div>
      </Model>
    </>
  );
};

export default RenameButton;
