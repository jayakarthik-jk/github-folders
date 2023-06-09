import useDeviceType from "@/hooks/useDeviceType";
import React, { useState, type FC } from "react";
import Button from "../common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFolder, faPlus } from "@fortawesome/free-solid-svg-icons";
import Model from "../common/Model";
import CreateFolderFormContent from "./CreateFolderFormContent";
import CreateRepoFormContent from "./CreateRepoFormContent";
import { twMerge } from "tailwind-merge";

interface AddNewProps {
  path: string[];
  className?: string;
  addToList: (item: FolderRepo) => void;
}

const AddNewButton: FC<AddNewProps> = ({ path, className, addToList }) => {
  const [modelVisibility, setModelVisibility] = useState(false);
  const [formVisibility, setFormVisibility] = useState(false);
  type Options = "Folder" | "Repo";
  const [selected, setSelected] = useState<Options>("Folder");
  const device = useDeviceType();

  const handleSelect = (selected: Options): void => {
    setModelVisibility(false);
    setFormVisibility(true);
    setSelected(selected);
  };
  const addBtnClass = twMerge(
    `fixed bottom-0 right-0 h-10 w-10 flex justify-center items-center ${
      device === "mobile" ? "bottom-2 right-2" : "bottom-6 right-6"
    } z-10 transition-all duration-300 bg-primary-300 border-primary-300 hover:bg-dark-100`,
    className
  );
  return (
    <>
      <Button
        className={addBtnClass}
        onClick={() => {
          setModelVisibility(true);
        }}
      >
        <FontAwesomeIcon icon={faPlus} size="lg" />
      </Button>
      <Model
        onClose={() => {
          setModelVisibility((visibility) => !visibility);
        }}
        className={modelVisibility ? "scale-100" : "scale-0"}
        containerClassName="p-16"
      >
        <div className="flex flex-col justify-center">
          <FontAwesomeIcon
            className="border-2 border-dark-100  p-2 px-4 rounded-lg hover:border-primary-300 cursor-pointer"
            icon={faFolder}
            size={device === "mobile" ? "5x" : "8x"}
            onClick={() => {
              handleSelect("Folder");
            }}
          />
          <span className="font-bold text-lg text-center">Folder</span>
        </div>
        <span>OR</span>
        <div className="flex flex-col justify-center">
          <FontAwesomeIcon
            icon={faFile}
            size={device === "mobile" ? "4x" : "7x"}
            className="relative border-2 border-dark-100 p-4 rounded-lg hover:border-primary-300 cursor-pointer"
            onClick={() => {
              handleSelect("Repo");
            }}
          />
          <span className="font-bold text-lg text-center">Repository</span>
        </div>
      </Model>

      <Model
        onClose={() => {
          setFormVisibility((visibility) => !visibility);
        }}
        className={formVisibility ? "scale-100" : "scale-0"}
        containerClassName="flex-col gap-8 p-8"
      >
        {selected === "Folder" ? (
          <CreateFolderFormContent
            closeModel={() => {
              setFormVisibility(false);
            }}
            path={path}
            addToList={addToList}
          />
        ) : (
          <CreateRepoFormContent
            closeModel={() => {
              setFormVisibility(false);
            }}
            path={path}
            addToList={addToList}
          />
        )}
      </Model>
    </>
  );
};

export default AddNewButton;
