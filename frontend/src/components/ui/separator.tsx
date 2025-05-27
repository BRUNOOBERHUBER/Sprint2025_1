import React from "react";

export const Separator: React.FC<{ className?: string }> = ({ className = "", ...props }) => (
  <hr className={`border-t border-gray-200 ${className}`} {...props} />
); 