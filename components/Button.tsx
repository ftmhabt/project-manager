"use client";

import { cva, VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, FC } from "react";

const buttonClass = cva(
  [
    "rounded-3xl",
    "font-bold",
    "hover:scale-110",
    "active:scale-100",
    "transition",
    "duration-200",
    "ease-in-out",
  ],
  {
    variants: {
      intent: {
        primary: [
          "bg-violet-500",
          "text-white",
          "border-transparent",
          "hover:bg-violet-600",
        ],
        secondary: [
          "bg-white",
          "text-black",
          "border-gray-400",
          "hover:bg-gray-100",
          "border-solid",
          "border-2",
          "border-gray-800",
        ],
        text: [
          "bg-transparent",
          "text-black",
          "hover:bg-white",
          "hover:bg-violet-600",
          "border-solid",
          "border-2",
          "border-violet-600",
        ],
      },
      size: {
        small: ["text-md", "py-1", "px-2"],
        medium: ["text-lg", "py-2", "px-6"],
        large: ["text-xlg", "py-4", "px-8"],
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "medium",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonClass> {}

const Button: FC<ButtonProps> = ({
  children,
  className,
  intent,
  size,
  ...props
}) => {
  return (
    <button className={buttonClass({ intent, size, className })} {...props}>
      {children}
    </button>
  );
};

export default Button;
