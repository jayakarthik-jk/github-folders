import { useState, type FC, useRef } from "react";
import Button from "../common/Button";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useDeviceType from "@/hooks/useDeviceType";
import Supabase from "@/lib/supabase";
import Model from "../common/Model";
import Spinner from "../common/Spinner";

interface RenameButtonProps {
  selected: FolderRepo[];
}

const RenameButton: FC<RenameButtonProps> = ({ selected }) => {
  const device = useDeviceType();
  const inputref = useRef<HTMLInputElement>(null);
  const [modelVisibility, setModelVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRenaming = async (): Promise<void> => {
    const name = inputref.current?.value;
    if (name === undefined) {
      console.log("developer error: cannot find input ref");
      setError("something went wrong, try again later");
      return;
    }
    setLoading(true);
    setError("");
    const res = await Supabase.renameFolder({
      id: selected[0].id,
      name,
    });
    setLoading(false);
    if (res instanceof Error) {
      setError(res.message);
      return;
    }
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
            className="p-2 px-12 rounded-lg border-2 focus:border-primary-300 focus:outline-none text-black disabled:cursor-not-allowed disabled:bg-gray-200"
            placeholder="Enter here"
            ref={inputref}
            name="foldername"
            disabled={loading}
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

export default RenameButton;
