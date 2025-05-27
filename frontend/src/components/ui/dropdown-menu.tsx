import React from "react";

export const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative inline-block text-left">{children}</div>
);

export const DropdownMenuTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({ children }) => <>{children}</>;

export const DropdownMenuContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">{children}</div>
);

export const DropdownMenuItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...props }) => (
  <div className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${className}`.trim()} {...props} />
); 