import clsx from "clsx";
import { ReactNode } from "react";

const GlassPane = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => {
  return (
    <div
      className={clsx(
        "rounded-2xl border-solid border-1 border-gray-200 backdrop-blur-lg",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassPane;
