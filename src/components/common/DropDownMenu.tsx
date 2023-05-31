import { FC } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContainerChildProps } from "./Container";
import {
  faArrowDown,
  faArrowUp,
  faList,
  faSearch,
  faTableCellsLarge,
} from "@fortawesome/free-solid-svg-icons";

interface DropDownMenuProps {
  visibility: boolean;
  setVisibility: (visibility: boolean) => void;
  size: ContainerChildProps["size"];
  setSize: (size: ContainerChildProps["size"]) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (sortOrder: "asc" | "desc") => void;
  searchBarVisibility: boolean;
  setSearchBarVisibility: (visibility: boolean) => void;
}

const DropDownMenu: FC<DropDownMenuProps> = ({
  visibility,
  setVisibility,
  size,
  setSize,
  sortOrder,
  setSortOrder,
  searchBarVisibility,
  setSearchBarVisibility,
}) => {
  return (
    <div
      className={`${
        visibility ? "top-12 right-6 scale-100" : "top-0 -right-12 scale-0"
      } bg-dark-100 absolute w-1/2 max-w-xs rounded-md p-4 transition-all duration-300 flex flex-col gap-4 z-10`}
    >
      <div
        className="flex justify-between items-center"
        onClick={() => {
          setVisibility(false);
          setSearchBarVisibility(!searchBarVisibility);
        }}
      >
        <div>Search Here</div>
        <FontAwesomeIcon icon={faSearch} size="lg" />
      </div>
      <hr className="border-dark-300" />

      <div
        className="flex justify-between items-center"
        onClick={() => {
          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        }}
      >
        <div>Sort</div>
        <FontAwesomeIcon
          icon={sortOrder === "asc" ? faArrowUp : faArrowDown}
          size="lg"
        />
      </div>
      <hr className="border-dark-300" />
      <div
        className="flex justify-between items-center"
        onClick={() => {
          setSize(size === "grid" ? "list" : "grid");
          setVisibility(false);
        }}
      >
        <h1>Layout</h1>
        <FontAwesomeIcon
          icon={size === "grid" ? faTableCellsLarge : faList}
          size="lg"
        />
      </div>
    </div>
  );
};

export default DropDownMenu;
