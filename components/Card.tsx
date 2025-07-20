import { FC, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const Card: FC<HTMLAttributes<HTMLDivElement>> = ({ children, className }) => {
  return (
    <div
      className={twMerge(
        "rounded-3xl px-8 py-4 drop-shadow-xl bg-white",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
