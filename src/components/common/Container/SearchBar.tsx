import type { LegacyRef, FC } from "react";

import { faArrowRight, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../Button";

interface SearchBarProps {
  visibility: boolean;
  setVisibility: (visibility: boolean) => void;
  searchQuery?: string;
  setSearchQuery?: (searchQuery: string) => void;
  placeholder?: string;
  onEnter?: () => void;
  inputRef?: LegacyRef<HTMLInputElement>;
}

const SearchBar: FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  setVisibility,
  visibility,
  placeholder = "Search",
  onEnter = () => {},
  inputRef,
}) => {
  return (
    <div
      className={`fixed z-10 left-0 ${
        visibility ? "bottom-0" : "-bottom-full"
      } w-full bg-dark-100 flex justify-center items-center gap-2 p-4 transition-all duration-300`}
    >
      <Button
        className="bg-dark-300 h-10 w-12"
        onClick={() => {
          setVisibility(false);
        }}
      >
        <FontAwesomeIcon icon={faClose} size="lg" />
      </Button>
      <input
        type="text"
        className="w-full h-10 rounded-md bg-dark-300 text-white text-center focus:outline-none"
        placeholder={placeholder}
        autoFocus={visibility}
        value={searchQuery}
        onChange={(e) => {
          if (setSearchQuery != null) {
            setSearchQuery(e.target.value);
          }
        }}
        onKeyDown={(e) => {
          e.key === "Enter" && onEnter();
        }}
        ref={inputRef}
      />
      {inputRef != null && (
        <Button
          className="bg-dark-300 h-10 w-12"
          onClick={() => {
            onEnter();
          }}
        >
          <FontAwesomeIcon icon={faArrowRight} size="lg" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
