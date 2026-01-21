export function TechLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/>
            <stop offset="50%" stopColor="#059669" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
          </linearGradient>
        </defs>
        
        {/* Animated tech lines */}
        <line x1="0" y1="30%" x2="100%" y2="30%" stroke="url(#lineGrad)" strokeWidth="2">
          <animate attributeName="x2" from="0%" to="100%" dur="3s" repeatCount="indefinite"/>
        </line>
        <line x1="0" y1="60%" x2="100%" y2="60%" stroke="url(#lineGrad)" strokeWidth="2">
          <animate attributeName="x2" from="0%" to="100%" dur="4s" repeatCount="indefinite"/>
        </line>
        <line x1="0" y1="80%" x2="100%" y2="80%" stroke="url(#lineGrad)" strokeWidth="1">
          <animate attributeName="x2" from="0%" to="100%" dur="5s" repeatCount="indefinite"/>
        </line>
        
        {/* Grid pattern */}
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="1"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3"/>
      </svg>
    </div>
  );
}

