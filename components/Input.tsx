"use client";

import clsx from "clsx";
import { FC, InputHTMLAttributes } from "react";
const Input: FC<InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  ...props
}) => {
  return (
    <input
      className={clsx(
        "boeder-solid border-black/40 border-2 px-6 py-2 text-lg rounded-3xl w-full text-black",
        className
      )}
      {...props}
      //put control stuff somewhere else for this component to remain server component
    />
  );
};

export default Input;
