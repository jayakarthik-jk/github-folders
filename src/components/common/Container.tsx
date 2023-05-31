"use client";

import { FC, cloneElement, useEffect, useState } from "react";
import { InputComponent } from "../../../types";

import Pagination from "./Pagination";
import ContainerNavbar from "./ContainerNavbar";
import DropDownMenu from "./DropDownMenu";
import SearchBar from "./SearchBar";
import { useRouter } from "next/navigation";

export interface ContainerProps {
  children?: InputComponent | InputComponent[]; // InputComponent type is defined in next-env.d.ts
  title: string;
  maxItemsPerPage?: number;
}

export interface ContainerChildProps {
  title: string;
  size?: "grid" | "list";
}

const Container: FC<ContainerProps> = ({
  children,
  title,
  maxItemsPerPage: pageSize = 30,
}) => {
  const [size, setSize] = useState<ContainerChildProps["size"]>("list");

  const [menuVisibility, setMenuVisibility] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchBarVisibility, setSearchBarVisibility] = useState(false);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const paginate = (components: InputComponent[]) => {
    const paginatedComponents = [...components];
    if (components.length > pageSize) {
      const start = (currentPage - 1) * pageSize;
      paginatedComponents.splice(0, start);
      paginatedComponents.splice(
        pageSize,
        paginatedComponents.length - pageSize
      );
    }
    return paginatedComponents;
  };

  const filter = (components: InputComponent[]) => {
    const filteredComponents = components.filter((component) =>
      new RegExp(searchQuery, "i").test(component.props.title)
    );
    return filteredComponents;
  };

  const sort = (components: InputComponent[]) => {
    const direction = sortOrder === "asc" ? 1 : -1;
    return components.sort(
      (a, b) => (a.props.title < b.props.title ? -1 : 1) * direction
    );
  };

  if (!children) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Nothing here
      </div>
    );
  }
  const allComponents: InputComponent[] = Array.isArray(children)
    ? children
    : [children];
  const filteredComponents = filter(allComponents);
  const sortedComponents = sort(filteredComponents);
  const paginatedComponents = paginate(sortedComponents);

  return (
    <div className="relative">
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
      <SearchBar
        visibility={searchBarVisibility}
        setVisibility={setSearchBarVisibility}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div
        className={`flex flex-col gap-4 pt-2 pb-20 px-2 transition-all duration-300 ${
          menuVisibility && "opacity-20"
        }`}
        onClick={menuVisibility ? () => setMenuVisibility(false) : undefined}
      >
        <ContainerNavbar
          title={title}
          menuVisibility={menuVisibility}
          setMenuVisibility={setMenuVisibility}
          onBack={() => router.back()}
        />
        <div
          className={`flex ${
            size === "grid" ? "flex-wrap justify-evenly" : "flex-col"
          } gap-4 scroll-smooth`}
        >
          {paginatedComponents.length <= 0 ? (
            <div className="flex justify-center items-center min-h-screen">
              Nothing here
            </div>
          ) : (
            paginatedComponents.map((child, index) =>
              cloneElement(child, { ...child.props, size, key: index })
            )
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          pageCount={Math.ceil(filteredComponents.length / pageSize)}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Container;
