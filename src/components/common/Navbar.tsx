import { useUser } from "@/context/UserContext";
import useDeviceType from "@/hooks/useDeviceType";
import {
  faArrowRightFromBracket,
  faArrowRightToBracket,
  faBars,
  faFolder,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { type FC } from "react";
import Button from "./Button";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Navbar: FC = () => {
  const deviceType = useDeviceType();
  const { user, login, logout } = useUser();
  const path = usePathname();
  if (deviceType === "mobile") {
    return (
      <nav className="sticky flex justify-between items-center p-2">
        <Button>
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
          <Button onClick={login}>
            Login
            <FontAwesomeIcon icon={faArrowRightToBracket} size="lg" />
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
