import React from "react";

export const Input = React.forwardRef(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`border rounded w-full p-2 ${className}`.trim()}
      {...props}
    />
  )
);
Input.displayName = "Input"; 