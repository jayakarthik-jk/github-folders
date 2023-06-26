import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { FC } from "react";
import Button from "../common/Button";
import useDeviceType from "@/hooks/useDeviceType";

interface AddNewButtonProps {
  path: string[];
}

const AddNewButton: FC<AddNewButtonProps> = ({ path }) => {
  const deviceType = useDeviceType();

  const handleAddingNewElement = (): void => {
    console.log("Adding new element");
  };
  return (
    <Button
      className={`fixed bottom-0 right-0 ${
        deviceType === "mobile" ? "bottom-2 right-2" : "bottom-6 right-6"
      } z-10`}
      onClick={handleAddingNewElement}
    >
      <FontAwesomeIcon icon={faPlus} size="lg" />
    </Button>
  );
};

export default AddNewButton;
