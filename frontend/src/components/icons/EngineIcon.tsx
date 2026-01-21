interface IconProps {
  className?: string;
  size?: number;
}

export function EngineIcon({ className, size = 24 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="5" y="8" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
      <rect x="8" y="11" width="3" height="4" fill="currentColor"/>
      <rect x="13" y="11" width="3" height="4" fill="currentColor"/>
      <path d="M9 8 V5 H11 V8" stroke="currentColor" strokeWidth="2"/>
      <path d="M15 8 V5 H13 V8" stroke="currentColor" strokeWidth="2"/>
      <path d="M5 12 H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M19 12 H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

