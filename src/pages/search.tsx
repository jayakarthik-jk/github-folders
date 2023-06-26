import Container from "@/components/common/Container";
import SearchBar from "@/components/common/SearchBar";
import * as GithubApi from "@/utils/githubApi";
import { useRouter } from "next/router";
import React, { useState, type FC, useRef, useEffect } from "react";
import User from "@/components/searchPage/User";

const SearchPage: FC = () => {
  const router = useRouter();
  const searchQueryRef = useRef<HTMLInputElement>(null);
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 100;
  const [sortOrder, setSortOrder] = useState<SortOptions>("asc");
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    startCursor: "",
    endCursor: "",
    hasNextPage: false,
    hasPreviousPage: false,
  });

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (searchQueryRef.current === null) {
        return;
      }
      const result = await GithubApi.searchUser({
        query:
          searchQueryRef.current.value === ""
            ? "github"
            : searchQueryRef.current.value,
        perPage: pageSize,
        pageInfo,
      });
      if (result === null) {
        return;
      }
      if (pageInfo.startCursor !== "" && pageInfo.endCursor !== "") {
        return;
      }
      setPageInfo(result.pageInfo);
      setUsers(result.nodes);
      setTotalCount(result?.userCount);
    };

    fetchData().catch((err) => {
      console.log(err);
    });
  }, [pageInfo]);

  return (
    <div>
      <Container
        title={
          totalCount === 0 ? "Search Results" : `${totalCount} Results Found`
        }
        currentPage={currentPage}
        onPageChange={(page) => {
          if (currentPage === page) {
            return;
          }

          if (currentPage < page) {
            if (pageInfo.hasNextPage) {
              setPageInfo({
                startCursor: pageInfo.endCursor,
                endCursor: "",
                hasPreviousPage: true,
                hasNextPage: false,
              });
            }
          } else {
            if (pageInfo.hasPreviousPage) {
              setPageInfo((prev) => {
                return {
                  endCursor: prev.startCursor,
                  startCursor: "",
                  hasNextPage: true,
                  hasPreviousPage: false,
                };
              });
            }
          }
          setCurrentPage(page);
        }}
        pageCount={Math.ceil(totalCount / pageSize)}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        visiblePagesCount={1}
      >
        {users.map((user) => {
          return <User user={user} title={user.login} key={user.login} />;
        })}
      </Container>
      <SearchBar
        inputRef={searchQueryRef}
        visibility
        setVisibility={() => {
          router.back();
        }}
        onEnter={() => {
          setPageInfo((prev) => {
            return { ...prev, endCursor: "" };
          });
        }}
      />
    </div>
  );
};

export default SearchPage;
