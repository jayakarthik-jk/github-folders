import type { FC } from "react";

const Spinner: FC = () => {
  // create a simple spinner

  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-300"></div>
    </div>
  );
};

export default Spinner;
