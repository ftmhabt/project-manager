import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

const Input: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <input
      className={clsx(
        "boeder-solid border-gray border-2 px-6 py-2 text-lg rounded-3xl w-full",
        className
      )}
      {...props}
      //put control stuff somewhere else for this component to remain server component
    />
  );
};

export default Input;
