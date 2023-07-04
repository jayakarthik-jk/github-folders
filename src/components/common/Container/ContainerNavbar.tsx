import { type FC } from "react";
import { faArrowLeft, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ContainerNavbarProps {
  title: string;
  menuVisibility: boolean;
  setMenuVisibility: (visibility: boolean) => void;
  onBack: () => void;
}

const ContainerNavbar: FC<ContainerNavbarProps> = ({
  title,
  menuVisibility,
  setMenuVisibility,
  onBack,
}) => {
  return (
    <div className="h-12 transition-all duration-300 flex justify-between items-center bg-dark-100 rounded-lg">
      <div
        className="flex justify-center items-center cursor-pointer mx-4 h-full"
        onClick={onBack}
      >
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
      </div>
      <span style={{ userSelect: "none" }}>{title}</span>
      <div
        className="flex justify-center items-center cursor-pointer mx-4 h-full"
        onClick={() => {
          setMenuVisibility(!menuVisibility);
        }}
      >
        <FontAwesomeIcon icon={faEllipsisH} size="lg" />
      </div>
    </div>
  );
};

export default ContainerNavbar;
