import { type FC, cloneElement, useEffect, useState, memo } from "react";

import Pagination from "./Pagination";
import ContainerNavbar from "./ContainerNavbar";
import DropDownMenu from "./DropDownMenu";
import SearchBar from "./SearchBar";
import { useRouter } from "next/navigation";
import useDeviceType from "@/hooks/useDeviceType";

export interface ContainerChildProps {
  title: string;
  size?: "grid" | "list";
}

export interface ContainerProps {
  children: InputComponent[]; // InputComponent type is defined in types.d.ts
  title: string;
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  sortOrder: SortOptions;
  setSortOrder: (option: SortOptions) => void;
  searchQuery?: string;
  setSearchQuery?: (searchQuery: string) => void;
  searchBarVisibility?: boolean;
  setSearchBarVisibility?: (visibility: boolean) => void;
  visiblePagesCount?: number;
}

const Container: FC<ContainerProps> = ({
  children: Components,
  title,
  currentPage,
  pageCount,
  onPageChange: handlePageChange,
  sortOrder,
  setSortOrder,
  searchQuery,
  setSearchQuery,
  searchBarVisibility,
  setSearchBarVisibility,
  visiblePagesCount,
}) => {
  const deviceType = useDeviceType();
  const [size, setSize] = useState<ContainerChildProps["size"]>(
    deviceType === "desktop" ? "grid" : "list"
  );
  const [menuVisibility, setMenuVisibility] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setSize(deviceType === "desktop" ? "grid" : "list");
  }, [deviceType]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="relative">
      <div
        className={`flex flex-col min-h-[90vh] pt-2 pb-32 transition-all duration-300 ${
          menuVisibility ? "opacity-20" : ""
        }`}
        onClick={
          menuVisibility
            ? () => {
                setMenuVisibility(false);
              }
            : undefined
        }
      >
        <ContainerNavbar
          title={title}
          menuVisibility={menuVisibility}
          setMenuVisibility={setMenuVisibility}
          onBack={() => {
            router.back();
          }}
        />
        <div
          className={`flex ${
            size === "grid" ? "flex-wrap justify-evenly" : "flex-col"
          } scroll-smooth my-8`}
        >
          {Components.length === 0 &&
          (searchQuery === "" || searchQuery == null) ? (
            <div className="flex justify-center items-center">Nothing here</div>
          ) : Components.length === 0 && searchQuery !== "" ? (
            <div className="flex justify-center items-center">
              No results found for {searchQuery}
            </div>
          ) : (
            Components.map((child, index) =>
              cloneElement(child, { ...child.props, size, key: index })
            )
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          visiblePagesCount={visiblePagesCount}
        />
      </div>
      <DropDownMenu
        visibility={menuVisibility}
        setVisibility={setMenuVisibility}
        size={size}
        setSize={setSize}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        searchBarVisibility={searchBarVisibility}
        setSearchBarVisibility={setSearchBarVisibility}
      />
      {searchQuery != null &&
        setSearchQuery != null &&
        searchBarVisibility != null &&
        setSearchBarVisibility != null && (
          <SearchBar
            visibility={searchBarVisibility}
            setVisibility={setSearchBarVisibility}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
    </div>
  );
};

export default memo(Container);
