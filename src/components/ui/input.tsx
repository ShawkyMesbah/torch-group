"use client";

import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  containerClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "modern" | "minimal";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      description,
      error,
      containerClassName,
      leftIcon,
      rightIcon,
      variant = "default",
      ...props
    },
    ref
  ) => {
    const id = React.useId();
    const [focused, setFocused] = React.useState(false);
    const [filled, setFilled] = React.useState(false);

    React.useEffect(() => {
      setFilled(Boolean(props.value || props.defaultValue));
    }, [props.value, props.defaultValue]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilled(e.target.value !== "");
      props.onChange?.(e);
    };

    return (
      <div className={cn("w-full space-y-2", containerClassName)}>
        {label && (
          <label
            htmlFor={props.id || id}
            className={cn(
              "text-sm font-medium text-gray-300",
              error && "text-red-500"
            )}
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative",
            variant === "modern" && "overflow-hidden",
            error && "has-error"
          )}
        >
          {leftIcon && (
            <div
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 text-gray-500",
                focused && "text-red-500",
                error && "text-red-500"
              )}
            >
              {leftIcon}
            </div>
          )}

          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              "border border-gray-800 bg-black/50 text-white placeholder:text-gray-500 focus-visible:ring-red-600 focus-visible:ring-offset-black",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              variant === "modern" &&
                "border-b border-t-0 border-l-0 border-r-0 rounded-none px-0 focus-visible:ring-0 bg-transparent",
              variant === "minimal" &&
                "border-b border-t-0 border-l-0 border-r-0 rounded-none px-0 focus-visible:ring-0 bg-transparent focus:border-red-600 transition-colors duration-200",
              error &&
                "border-red-500 placeholder:text-red-400/50 focus-visible:ring-red-500",
              className
            )}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            id={props.id || id}
            {...props}
          />

          {rightIcon && (
            <div
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500",
                focused && "text-red-500",
                error && "text-red-500"
              )}
            >
              {rightIcon}
            </div>
          )}

          {variant === "modern" && (
            <div
              className={cn(
                "absolute bottom-0 left-0 h-0.5 w-0 bg-red-600 transition-all duration-300",
                focused && "w-full"
              )}
            />
          )}
        </div>

        {(description || error) && (
          <p
            className={cn(
              "text-xs",
              error ? "text-red-500" : "text-gray-400"
            )}
          >
            {error || description}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input }
