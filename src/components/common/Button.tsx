import type { ReactNode, FC } from "react";

import { twMerge } from "tailwind-merge";

interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({
  onClick: handleClick,
  children,
  className = "",
  disabled = false,
}) => {
  const defaultClasses =
    "transition-all duration-300 h-10 bg-dark-100 border-2 border-dark-100 p-2 px-4 rounded-lg font-semibold flex gap-2 items-center hover:border-primary-300 disabled:opacity-50 disabled:cursor-not-allowed";

  className = twMerge(defaultClasses, className);

  return (
    <button className={className} onClick={handleClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
