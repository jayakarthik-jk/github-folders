import { useState, type FC } from "react";
import Button from "../common/Button";
import useDeviceType from "@/hooks/useDeviceType";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Supabase from "@/lib/supabase";
import Model from "../common/Model";
import Spinner from "../common/Spinner";
import { useUser } from "@/context/UserContext";

interface DeleteButtonProps {
  selected: FolderRepo[];
  removeFromList: (ids: number[]) => void;
  setSelected: (selected: FolderRepo[]) => void;
}

const DeleteButton: FC<DeleteButtonProps> = ({
  selected,
  removeFromList,
  setSelected,
}) => {
  const device = useDeviceType();
  const [modelVisibility, setModelVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useUser();
  const mobileUp = "bottom-16 right-2";
  const mobileDown = "bottom-2 right-2";
  const desktopUp = "bottom-20 right-6";
  const desktopDown = "bottom-6 right-6";
  const handleDeleting = async (): Promise<void> => {
    const folderIds = new Array<number>();
    const repoIds = new Array<number>();
    selected.forEach((s) =>
      Supabase.isFolderType(s) ? folderIds.push(s.id) : repoIds.push(s.id)
    );
    if (user == null || user.user_metadata.user_name == null) {
      setError("Something went wrong, please try logging in again");
      return;
    }
    const userName = user.user_metadata.user_name;
    const userId = user.id;
    setLoading(true);
    if (folderIds.length > 0) {
      const error = await Supabase.deleteFolders({
        ids: folderIds,
        userName,
        userId,
      });
      if (error !== null) {
        setError(error.message);
        setLoading(false);
        return;
      }
    }
    if (repoIds.length > 0) {
      const error = await Supabase.deleteRepos({
        ids: repoIds,
        userName,
        userId,
      });
      if (error !== null) {
        setError(error.message);
        setLoading(false);

        return;
      }
    }
    setLoading(false);
    setModelVisibility(false);
    setSelected([]);
    removeFromList([...folderIds, ...repoIds]);
  };
  return (
    <>
      <Button
        className={`fixed ${
          selected.length === 1
            ? Supabase.isFolderType(selected[0])
              ? device === "mobile"
                ? mobileUp
                : desktopUp
              : device === "mobile"
              ? mobileDown
              : desktopDown
            : selected.length > 1
            ? device === "mobile"
              ? mobileDown
              : desktopDown
            : "bottom-2 -right-full"
        } h-10 w-10 flex justify-center items-center z-10 transition-all duration-300 bg-red-500 border-red-500 hover:border-red-500 hover:bg-dark-100`}
        onClick={() => {
          setModelVisibility(true);
        }}
      >
        <FontAwesomeIcon icon={faTrash} size="lg" />
      </Button>
      <Model
        onClose={() => {
          setModelVisibility(false);
        }}
        className={modelVisibility ? "scale-100" : "scale-0"}
      >
        <div className="flex flex-col gap-4">
          Do you want to permanently delete the seleted
          <div className="flex justify-end gap-4">
            <Button
              onClick={() => {
                setModelVisibility(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-dark-100 hover:border-red-500"
              onClick={() => {
                handleDeleting().catch((err) => {
                  setError("Something went wrong, please try again later");
                  setLoading(false);
                  console.log(err);
                });
              }}
            >
              delete
            </Button>
          </div>
          {loading && <Spinner />}
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

export default DeleteButton;
