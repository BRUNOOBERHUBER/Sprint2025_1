import React from "react";

export const Table = ({ className = "", ...props }) => (
  <table className={`min-w-full ${className}`.trim()} {...props} />
);
export const TableHeader = ({ children, ...props }) => (
  <thead {...props}>{children}</thead>
);
export const TableHead = ({ className = "", ...props }) => (
  <th className={`py-2 text-left ${className}`.trim()} {...props} />
);
export const TableBody = ({ children, ...props }) => (
  <tbody {...props}>{children}</tbody>
);
export const TableRow = ({ children, ...props }) => (
  <tr {...props}>{children}</tr>
);
export const TableCell = ({ className = "", ...props }) => (
  <td className={`py-2 ${className}`.trim()} {...props} />
); 