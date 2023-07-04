import { type FC } from "react";
import type { ContainerChildProps } from "../common/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import withDoubleClick from "@/hoc/withDoubleClick";
import { faGit } from "@fortawesome/free-brands-svg-icons";

interface RepoProps extends ContainerChildProps, RepoType {
  onClick?: () => void;
  onSingleClick: () => void;
  onDoubleClick: () => void;
  selected?: boolean;
}

// If you change the style of the repo don't forget to change it in the Add new Repo form also
const Repo: FC<RepoProps> = ({
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
      <div className="relative">
        <FontAwesomeIcon
          icon={faFile}
          className={`${size === "grid" ? "w-32" : "w-12"} ${
            selected ? "text-dark-200" : "text-white"
          }`}
          size={size === "grid" ? "7x" : "3x"}
        />
        <FontAwesomeIcon
          icon={faGit}
          className={`absolute top-0 left-0 inset-0 m-auto ${
            selected ? "text-white" : "text-dark-200"
          }`}
          size={size === "grid" ? "3x" : "1x"}
        />
      </div>
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

export default withDoubleClick(Repo);
