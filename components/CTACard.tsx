import React from "react";

interface CTACardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
  isAlert?: boolean;
}

export const CTACard: React.FC<CTACardProps> = ({
  icon,
  title,
  description,
  buttonText,
  onButtonClick,
  isAlert,
}) => {
  return (
    <div className="flex flex-col bg-card/40 border border-white/5 hover:border-white/10 transition-all duration-300 rounded-2xl p-8 gap-6 items-center justify-center text-center">
      <div className="text-4xl">{icon}</div>
      <div className="flex flex-col gap-2">
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        <p className="text-white/50 text-sm max-w-xs">{description}</p>
      </div>
      <button
        onClick={onButtonClick}
        className={`${
          isAlert ? "bg-base hover:bg-base/90" : "bg-base hover:bg-base/90"
        } px-8 py-3 rounded-full text-white font-semibold text-sm transition-all duration-200 active:scale-95`}
      >
        {buttonText}
      </button>
    </div>
  );
};
