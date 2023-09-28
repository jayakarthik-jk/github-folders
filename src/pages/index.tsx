import Image from "next/image";
import { useRouter } from "next/router";
import { type FC } from "react";

import Button from "@/components/common/Button";
import { useUser } from "@/context/UserContext";
import { faRightToBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Home: FC = () => {
  const { user, login } = useUser();
  const router = useRouter();
  return (
    <main className="h-[90vh] w-full flex flex-col justify-center items-center">
      <span>welcome to github folders</span>
      {user !== null ? (
        <Button
          className="justify-center m-4 p-0"
          onClick={async () => {
            await router.push(`/${user.user_metadata.user_name as string}`);
          }}
        >
          {user.user_metadata.avatar_url == null ||
          user.user_metadata.avatar_url === "" ? (
            <FontAwesomeIcon icon={faUser} size="lg" />
          ) : (
            <Button>
              <span className="text-lg font-medium">Workspace</span>
              <Image
                src={user.user_metadata.avatar_url as string}
                alt="avatar"
                width={24}
                height={24}
                className="rounded-full w-fit"
              />
            </Button>
          )}
        </Button>
      ) : (
        <Button
          className="m-4 justify-center bg-primary-300 border-x-primary-300 hover:bg-dark-100"
          onClick={login}
        >
          Login <FontAwesomeIcon icon={faRightToBracket} size="lg" />
        </Button>
      )}
      <span>Home page need some works😅</span>
    </main>
  );
};

export default Home;
