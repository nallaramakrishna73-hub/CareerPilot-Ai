import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  showSubtitle?: boolean;
  className?: string;
  theme?: "dark" | "light" | "auto";
}

export const LogoIcon: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = "" }) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-lg shadow-indigo-950/20 select-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: "linear-gradient(145deg, #070D24 0%, #121E4C 45%, #27318A 80%, #3B3FD8 100%)",
        padding: `${Math.max(3, size * 0.08)}px`,
      }}
    >
      {/* Ambient glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
        style={{
          background: "radial-gradient(circle at 35% 30%, rgba(20,184,166,0.4), transparent 60%)"
        }}
      />
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-sm"
      >
        {/* Teal circular 'C' ring with open upper-right gap */}
        <path
          d="M 68 33 A 33 33 0 1 0 71 67"
          stroke="#14B8A6"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Amber pointer arrow with circle pivot at bottom-left */}
        <g id="arrow">
          {/* Arrow shaft */}
          <path
            d="M 40 60 L 59 41"
            stroke="#FFB020"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* Circular base dot */}
          <circle cx="39" cy="61" r="2.8" fill="#0B1437" />

          {/* Arrowhead pointed up-right */}
          <path
            d="M 52 35 L 70 30 L 65 48 Z"
            fill="#FFB020"
            stroke="#FFB020"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showWordmark = true,
  showSubtitle = false,
  className = "",
  theme = "auto",
}) => {
  const iconSizes = {
    sm: 30,
    md: 40,
    lg: 52,
    xl: 68,
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  };

  const badgeSizes = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2 py-0.5",
    lg: "text-sm px-2.5 py-1",
    xl: "text-base px-3 py-1",
  };

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div className="flex items-center gap-2.5">
        <LogoIcon size={iconSizes[size]} />
        {showWordmark && (
          <div className="flex items-center gap-1.5">
            <span
              className={`font-bold tracking-tight ${textSizes[size]} ${
                theme === "dark" 
                  ? "text-white" 
                  : theme === "light" 
                  ? "text-[#0B1437]" 
                  : "text-[#0B1437] dark:text-white"
              }`}
            >
              Career<span className="text-[#3B3FD8] dark:text-[#6366F1]">Pilot</span>
            </span>
            <span
              className={`font-extrabold uppercase rounded-lg bg-[#FFB020] text-[#0B1437] shadow-sm tracking-wider ${badgeSizes[size]}`}
            >
              AI
            </span>
          </div>
        )}
      </div>
      {showSubtitle && (
        <div className="mt-1">
          <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400">
            Your AI career copilot for the Indian job market
          </p>
          <div className="h-0.5 w-12 bg-[#14B8A6] rounded-full mt-0.5"></div>
        </div>
      )}
    </div>
  );
};

export default Logo;
