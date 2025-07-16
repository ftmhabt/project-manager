import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

const Card: FC<HTMLAttributes<HTMLDivElement>> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        "rounded-3xl px-8 py-4 drop-shadow-xl bg-white",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
