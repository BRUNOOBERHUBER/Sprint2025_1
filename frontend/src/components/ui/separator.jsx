import React from "react";

export const Separator = ({ className = "", ...props }) => (
  <hr className={`border-t border-gray-200 ${className}`} {...props} />
); 