import React from "react";

interface SectionHeaderProps {
  icon?: React.ReactNode;
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
}) => {
  return (
    <div className="flex items-center gap-2">
      {icon && <div className="text-base">{icon}</div>}
      <h2 className="text-white text-sm font-semibold">{title}</h2>
    </div>
  );
};
