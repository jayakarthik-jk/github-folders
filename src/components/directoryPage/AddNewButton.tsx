import useDeviceType from "@/hooks/useDeviceType";
import React, { useState, type FC } from "react";
import Button from "../common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFolder, faPlus } from "@fortawesome/free-solid-svg-icons";
import Model from "../common/Model";
import { faGit } from "@fortawesome/free-brands-svg-icons";
import CreateFolderFormContent from "./CreateFolderFormContent";
import CreateRepoFormContent from "./CreateRepoFormContent";

interface AddNewProps {
  path: string[];
}

const AddNew: FC<AddNewProps> = ({ path }) => {
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
  return (
    <>
      <Button
        className={`fixed bottom-0 right-0 h-10 w-10 flex justify-center items-center ${
          device === "mobile" ? "bottom-2 right-2" : "bottom-6 right-6"
        } z-10`}
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
        className={`transition-all duration-300 ${
          modelVisibility ? "scale-100" : "scale-0"
        }`}
      >
        <FontAwesomeIcon
          className="border-2 border-dark-100  p-2 px-4 rounded-lg hover:border-primary-300 cursor-pointer"
          icon={faFolder}
          size={device === "mobile" ? "5x" : "8x"}
          onClick={() => {
            handleSelect("Folder");
          }}
        />
        <span>OR</span>
        <div
          className="relative border-2 border-dark-100 p-4 rounded-lg hover:border-primary-300 cursor-pointer"
          onClick={() => {
            handleSelect("Repo");
          }}
        >
          <FontAwesomeIcon
            icon={faFile}
            size={device === "mobile" ? "5x" : "8x"}
          />
          <FontAwesomeIcon
            icon={faGit}
            size={device === "mobile" ? "2x" : "3x"}
            className="absolute top-0 left-0 inset-0 m-auto text-dark-300"
          />
        </div>
      </Model>

      <Model
        onClose={() => {
          setFormVisibility((visibility) => !visibility);
        }}
        className={`transition-all duration-300 ${
          formVisibility ? "scale-100" : "scale-0"
        }`}
        containerClassName="flex-col gap-8 p-8"
      >
        {selected === "Folder" ? (
          <CreateFolderFormContent
            closeModel={() => {
              setFormVisibility(false);
            }}
            path={path}
          />
        ) : (
          <CreateRepoFormContent
            closeModel={() => {
              setFormVisibility(false);
            }}
            path={path}
          />
        )}
      </Model>
    </>
  );
};

export default AddNew;
