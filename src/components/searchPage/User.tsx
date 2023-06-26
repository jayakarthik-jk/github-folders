import Image from "next/image";
import { type FC, memo } from "react";
import type { ContainerChildProps } from "../common/Container";
import Link from "next/link";

interface UserProps extends ContainerChildProps {
  user: SearchUser;
}

const User: FC<UserProps> = ({ user, size }) => {
  const iconRadius = size === "list" ? 50 : 100;

  return (
    <Link href={`/${user.login}`}>
      <div
        className={`flex items-center p-4 ${
          size === "list"
            ? "w-full justify-start gap-4"
            : "w-fit flex-col justify-center"
        }`}
      >
        <Image
          src={user.avatarUrl}
          alt="user avatar"
          width={iconRadius}
          height={iconRadius}
          className="rounded-full"
        />
        <span className={`${size === "grid" ? "text-white" : ""}`}>
          {size === "grid"
            ? user.login.length > 16
              ? user.login.slice(0, 16) + "..."
              : user.login
            : user.login}
        </span>
      </div>
    </Link>
  );
};

export default memo(User);
