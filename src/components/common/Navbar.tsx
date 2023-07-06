import { useUser } from "@/context/UserContext";
import useDeviceType from "@/hooks/useDeviceType";
import {
  faArrowRightFromBracket,
  faArrowRightToBracket,
  faBars,
  faFolder,
  faRightFromBracket,
  faRightToBracket,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState, type FC } from "react";
import Button from "./Button";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/router";

const Navbar: FC = () => {
  const deviceType = useDeviceType();
  const { user, login, logout } = useUser();
  const path = usePathname();
  const router = useRouter();
  const [sidebarVisibility, setSidebarVisibility] = useState(false);
  if (deviceType === "mobile") {
    return (
      <>
        <nav className="sticky flex justify-between items-center p-2">
          <Button
            onClick={() => {
              setSidebarVisibility(true);
            }}
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </Button>
          <Link href="/" className="flex justify-center items-center">
            <FontAwesomeIcon icon={faFolder} size="2xl" />
          </Link>
          {path !== "/search" ? (
            <Link href="/search">
              <Button>
                <FontAwesomeIcon icon={faSearch} size="lg" />
              </Button>
            </Link>
          ) : (
            <Button>
              <FontAwesomeIcon icon={faSearch} size="lg" />
            </Button>
          )}
        </nav>
        <div
          className={`z-20 fixed top-0 bottom-0 right-0 w-full h-full ${
            sidebarVisibility ? "left-0" : "-left-full"
          } transition-all duration-300 flex`}
        >
          <div className="w-1/5 h-full bg-dark-100 flex flex-col justify-between">
            <div className="flex justify-center flex-col">
              <Button
                className="justify-center m-4 mb-0"
                onClick={async () => {
                  await router.push("/");
                  setSidebarVisibility(false);
                }}
              >
                <FontAwesomeIcon icon={faFolder} size="lg" />
              </Button>

              {user !== null ? (
                <Button
                  className="justify-center m-4 p-0"
                  onClick={async () => {
                    await router.push(
                      `/${user.user_metadata.user_name as string}`
                    );
                    setSidebarVisibility(false);
                  }}
                >
                  {user.user_metadata.avatar_url == null ||
                  user.user_metadata.avatar_url === "" ? (
                    <FontAwesomeIcon icon={faUser} size="lg" />
                  ) : (
                    <Image
                      src={user.user_metadata.avatar_url as string}
                      alt="avatar"
                      width={24}
                      height={24}
                      className="rounded-full w-fit"
                    />
                  )}
                </Button>
              ) : (
                <Button className="justify-center m-4">
                  <FontAwesomeIcon icon={faUser} size="lg" />
                </Button>
              )}
            </div>
            {user !== null ? (
              <Button className="m-4 justify-center" onClick={logout}>
                <FontAwesomeIcon icon={faRightFromBracket} size="lg" />
              </Button>
            ) : (
              <Button
                className="m-4 justify-center bg-primary-300 border-x-primary-300 hover:bg-dark-100"
                onClick={login}
              >
                <FontAwesomeIcon icon={faRightToBracket} size="lg" />
              </Button>
            )}
          </div>
          <div
            className={`w-4/5 h-full bg-dark-300 ${
              sidebarVisibility ? "opacity-50" : "opacity-0"
            }`}
            onClick={() => {
              setSidebarVisibility(false);
            }}
          ></div>
        </div>
      </>
    );
  }
  return (
    <nav className="sticky flex justify-between items-center pt-4 pb-2">
      <Link href="/" className="flex justify-center items-center gap-4">
        <FontAwesomeIcon icon={faFolder} size="2xl" />
        Github Folders
      </Link>
      <div className="flex justify-center items-center gap-2">
        {path !== "/search" && (
          <Link href="/search">
            <Button>
              <FontAwesomeIcon icon={faSearch} size="lg" />
            </Button>
          </Link>
        )}
        {user !== null ? (
          <>
            <Link href={`/${user.user_metadata.user_name as string}`}>
              <Button>
                {user.user_metadata.avatar_url == null ||
                user.user_metadata.avatar_url === "" ? (
                  <FontAwesomeIcon icon={faUser} size="lg" />
                ) : (
                  <Image
                    src={user.user_metadata.avatar_url as string}
                    alt="avatar"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                Workspace
              </Button>
            </Link>
            <Button onClick={logout}>
              Logout
              <FontAwesomeIcon icon={faArrowRightFromBracket} size="lg" />
            </Button>
          </>
        ) : (
          <Button
            onClick={login}
            className="bg-primary-300 border-primary-300 hover:bg-dark-100"
          >
            Login
            <FontAwesomeIcon icon={faArrowRightToBracket} size="lg" />
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
