import React from "react";

export const DropdownMenu = ({ children }) => (
  <div className="relative inline-block text-left">{children}</div>
);

export const DropdownMenuTrigger = ({ asChild, children }) => <>{children}</>;

export const DropdownMenuContent = ({ children }) => (
  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">{children}</div>
);

export const DropdownMenuItem = ({ className = "", ...props }) => (
  <div className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${className}`.trim()} {...props} />
); 