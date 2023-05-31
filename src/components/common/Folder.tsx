"use client";
import { FC } from "react";
import { ContainerChildProps } from "./Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";

export interface FolderProps extends ContainerChildProps {}

const Folder: FC<FolderProps> = ({ size = "list", title }) => {
  let iconWidth = size === "grid" ? 120 : 60;

  return (
    <div
      className={`w-fit flex items-center gap-4 ${
        size === "list" ? "justify-start" : "justify-center"
      }`}
    >
      <FontAwesomeIcon icon={faFolder} size={size === "grid" ? "7x" : "3x"} />
      <span className={`${size === "grid" ? "absolute text-black" : ""}`}>
        {size === "grid"
          ? title.length > 10
            ? title.slice(0, 10) + "..."
            : title
          : title}
      </span>
    </div>
  );
};

export default Folder;
