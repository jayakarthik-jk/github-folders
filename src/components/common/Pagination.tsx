"use client";

import { FC } from "react";

import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  pageCount,
  onPageChange,
}) => {
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  if (pageCount <= 1) return null;
  return (
    <nav aria-label="Page navigation">
      <ul className="list-style-none flex justify-center items-center">
        <li>
          <button
            className={`relative block rounded-full bg-transparent px-3 py-1.5 text-sm text-neutral-600 ${
              currentPage === 1
                ? "dark:text-neutral-400"
                : "hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
            }`}
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
          </button>
        </li>
        {pages.map((page) => (
          <li key={page}>
            <button
              className={`relative block rounded-full px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white ${
                currentPage === page
                  ? "bg-[#763ec7] text-[#763ec7]"
                  : "bg-transparent"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
        <li>
          <button
            className={`relative block rounded-full bg-transparent px-3 py-1.5 text-sm text-neutral-600 ${
              currentPage === pages.length
                ? "dark:text-neutral-400"
                : "hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
            }`}
            disabled={currentPage === pages.length}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <FontAwesomeIcon icon={faArrowRight} size="lg" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
