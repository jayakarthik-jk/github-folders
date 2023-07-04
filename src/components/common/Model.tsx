import type { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import { twMerge } from "tailwind-merge";

interface ModelProps {
  children: any;
  onClose: () => void;
  containerClassName?: string;
  className?: string;
}

const Model: FC<ModelProps> = ({
  children,
  onClose,
  containerClassName = "",
  className = "",
}) => {
  const classes = twMerge(
    "fixed left-0 top-0 right-0 bottom-0 z-10 flex justify-center items-center",
    className
  );

  const containerClassess = twMerge(
    "relative bg-dark-100 text-white p-16 flex justify-center items-center gap-4 rounded-lg max-w-[90vw]",
    containerClassName
  );

  return (
    <div className={classes}>
      <div className={containerClassess}>
        <Button className="absolute top-0 right-0" onClick={onClose}>
          <FontAwesomeIcon icon={faClose} size="lg" />
        </Button>
        {children}
      </div>
    </div>
  );
};

export default Model;
