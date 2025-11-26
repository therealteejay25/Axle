import React from "react";

interface InsightItemProps {
  icon?: React.ReactNode;
  text: string;
}

export const InsightItem: React.FC<InsightItemProps> = ({ icon, text }) => {
  return (
    <div className="flex items-start gap-3">
      {icon && <div className="text-base mt-1 shrink-0">{icon}</div>}
      <p className="text-white/70 text-sm leading-relaxed">{text}</p>
    </div>
  );
};
