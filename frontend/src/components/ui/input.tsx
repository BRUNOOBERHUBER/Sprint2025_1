import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`border rounded w-full p-2 ${className}`.trim()}
      {...props}
    />
  )
);
Input.displayName = "Input"; 