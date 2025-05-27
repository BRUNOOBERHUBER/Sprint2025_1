import React from "react";

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({ className = "", ...props }) => (
  <table className={`min-w-full ${className}`.trim()} {...props} />
);
export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ children, ...props }) => (
  <thead {...props}>{children}</thead>
);
export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ className = "", ...props }) => (
  <th className={`py-2 text-left ${className}`.trim()} {...props} />
);
export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ children, ...props }) => (
  <tbody {...props}>{children}</tbody>
);
export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ children, ...props }) => (
  <tr {...props}>{children}</tr>
);
export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ className = "", ...props }) => (
  <td className={`py-2 ${className}`.trim()} {...props} />
); 