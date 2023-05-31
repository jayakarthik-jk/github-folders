import { FC } from "react";
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
    <div className="h-12 transition-all duration-300 flex justify-between items-center bg-dark-100 rounded-md">
      <FontAwesomeIcon
        icon={faArrowLeft}
        className="mx-4"
        onClick={onBack}
        size="lg"
      />
      {title}
      <FontAwesomeIcon
        icon={faEllipsisH}
        onClick={() => setMenuVisibility(!menuVisibility)}
        className="mx-4"
      />
    </div>
  );
};

export default ContainerNavbar;
