import { type FC } from "react";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useDeviceType from "@/hooks/useDeviceType";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  visiblePagesCount?: number;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  pageCount,
  onPageChange,
  visiblePagesCount,
}) => {
  const deviceType = useDeviceType();
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const visiblePages = getVisiblePages(
    currentPage,
    pages,
    visiblePagesCount != null
      ? visiblePagesCount
      : deviceType === "desktop"
      ? 10
      : 5
  );

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
            onClick={() => {
              onPageChange(currentPage - 1);
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
          </button>
        </li>
        {visiblePages.map((page, index) => (
          <li key={page}>
            <button
              className={`relative block rounded-full px-3 py-1.5 text-sm text-white ${
                currentPage === page
                  ? "bg-primary-300"
                  : "bg-transparent hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
              }`}
              onClick={() => {
                onPageChange(page);
              }}
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
            onClick={() => {
              onPageChange(currentPage + 1);
            }}
          >
            <FontAwesomeIcon icon={faArrowRight} size="lg" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;

function getVisiblePages(
  currentPage: number,
  pages: number[],
  visiblePagesCount = 10
): number[] {
  const totalPages = pages.length;
  const range = Math.floor(visiblePagesCount / 2);

  if (totalPages <= visiblePagesCount) {
    return pages;
  }

  if (currentPage <= range) {
    return pages.slice(0, visiblePagesCount);
  }

  if (currentPage >= totalPages - range) {
    return pages.slice(totalPages - visiblePagesCount);
  }

  const start = currentPage - range - 1;
  const end = currentPage + range;
  return pages.slice(start, end);
}
