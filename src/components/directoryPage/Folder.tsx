import { type FC } from "react";
import type { ContainerChildProps } from "../common/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
// import Link from "next/link";
import withDoubleClick from "@/hoc/withDoubleClick";

interface FolderProps extends ContainerChildProps, FolderType {
  onClick?: (e: React.MouseEvent) => void;
  onSingleClick: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
  selected?: boolean;
}

const Folder: FC<FolderProps> = ({
  size = "list",
  title,
  onClick: handleClick,
  selected = false,
}) => {
  return (
    <div
      onClick={handleClick}
      className={`flex items-center cursor-pointer p-4 rounded-lg ${
        size === "list"
          ? "w-full justify-start gap-4"
          : "w-fit flex-col justify-center"
      }
      ${selected ? "bg-white" : ""}
      `}
    >
      <FontAwesomeIcon
        icon={faFolder}
        className={`${size === "grid" ? "w-32" : "w-12"} ${
          selected ? "text-dark-200" : "text-white"
        }`}
        size={size === "grid" ? "7x" : "3x"}
      />
      <span
        className={`${selected ? "text-dark-200" : "text-white"}`}
        style={{ userSelect: "none" }}
      >
        {size === "grid"
          ? title.length > 30
            ? title.slice(0, 30) + "..."
            : title
          : title}
      </span>
    </div>
  );
};

export default withDoubleClick(Folder);
