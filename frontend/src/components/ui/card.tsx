import React from "react";

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<DivProps> = ({ className = "", ...props }) => (
  <div
    className={`rounded-lg bg-white shadow border ${className}`.trim()}
    {...props}
  />
);

export const CardHeader: React.FC<DivProps> = ({ className = "", ...props }) => (
  <div className={`px-6 py-4 ${className}`.trim()} {...props} />
);

export const CardTitle: React.FC<DivProps> = ({ className = "", ...props }) => (
  <h3 className={`text-lg font-semibold ${className}`.trim()} {...props} />
);

export const CardContent: React.FC<DivProps> = ({ className = "", ...props }) => (
  <div className={`px-6 py-4 ${className}`.trim()} {...props} />
); 