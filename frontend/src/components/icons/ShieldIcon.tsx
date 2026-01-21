interface IconProps {
  className?: string;
  size?: number;
}

export function ShieldIcon({ className, size = 24 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M12 3 L4 6 V12 C4 16.5 7.5 20.5 12 21.5 C16.5 20.5 20 16.5 20 12 V6 L12 3Z" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M9 12 L11 14 L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

