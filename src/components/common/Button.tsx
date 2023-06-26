import { type FC } from "react";

import { twMerge } from "tailwind-merge";

interface ButtonProps {
  onClick?: () => void;
  children: any;
  className?: string;
}

const Button: FC<ButtonProps> = ({
  onClick: handleClick,
  children,
  className = "",
}) => {
  const defaultClasses =
    "h-10 bg-dark-100 border-2 border-dark-100 p-2 px-4 rounded-lg font-semibold flex gap-2 items-center hover:border-primary-300";

  className = twMerge(defaultClasses, className);

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
};

export default Button;
