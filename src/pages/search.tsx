import Container from "@/components/common/Container";
import SearchBar from "@/components/common/Container/SearchBar";
import GithubApi from "@/lib/githubApi";
import { useRouter } from "next/router";
import React, { useState, type FC, useRef, useEffect } from "react";
import User from "@/components/searchPage/User";
import Spinner from "@/components/common/Spinner";
import { useUser } from "@/context/UserContext";

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { logout } = useUser();
  useEffect(() => {
    setLoading(true);
    const fetchData = async (): Promise<void> => {
      if (searchQueryRef.current === null) {
        console.log("developer error: searchQueryRef is null");
        setError("Something went wrong");
        setLoading(false);
        return;
      }

      if (pageInfo.startCursor !== "" && pageInfo.endCursor !== "") {
        setLoading(false);
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

      if (result instanceof Error) {
        setError("Login to search more users");
        setLoading(false);
        await logout();
        return;
      }
      setPageInfo(result.pageInfo);
      setUsers(result.nodes);
      setTotalCount(result.userCount);
      setLoading(false);
    };

    fetchData().catch((err) => {
      setError("Something went wrong");
      setLoading(false);
      console.log(err);
    });
  }, [logout, pageInfo]);

  return (
    <div>
      {error !== "" ? (
        <div className="flex justify-center items-center w-full h-[90vh] text-lg font-bold text-red-500">
          {error}
        </div>
      ) : loading ? (
        <span className="flex justify-center items-center w-full h-[90vh]">
          <Spinner />
        </span>
      ) : (
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
      )}
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
