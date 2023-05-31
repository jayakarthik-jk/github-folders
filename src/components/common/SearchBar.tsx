import { FC } from "react";

import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SearchBarProps {
  visibility: boolean;
  setVisibility: (visibility: boolean) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  placeholder?: string;
}

const SearchBar: FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  setVisibility,
  visibility,
  placeholder = "Search",
}) => {
  return (
    <div
      className={`fixed left-0 ${
        visibility ? "bottom-0" : "-bottom-full"
      } w-full bg-dark-100 flex justify-center items-center gap-2 p-4 transition-all duration-300`}
    >
      <div
        className="rounded-md bg-dark-300 h-12 w-12 flex justify-center items-center"
        onClick={() => setVisibility(false)}
      >
        <FontAwesomeIcon icon={faClose} size="lg" />
      </div>
      <input
        type="text"
        className="w-full h-12 rounded-md bg-dark-300 text-white text-center focus:outline-none"
        placeholder={placeholder}
        autoFocus={visibility}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && setVisibility(false)}
      />
    </div>
  );
};

export default SearchBar;
