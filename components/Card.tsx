import clsx from "clsx";
import { FC, HTMLAttributes } from "react";

const Card: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "rounded-3xl px-10 py-4 drop-shadow-xl bg-white",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
