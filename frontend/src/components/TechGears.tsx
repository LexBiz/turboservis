export function TechGears() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {/* Gear 1 - top right */}
      <svg 
        className="absolute top-10 right-10 w-32 h-32 text-primary-500 animate-spin-slow"
        style={{ animationDuration: '20s' }}
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M50,10 L55,20 L65,18 L62,28 L72,32 L65,40 L72,48 L62,52 L65,62 L55,60 L50,70 L45,60 L35,62 L38,52 L28,48 L35,40 L28,32 L38,28 L35,18 L45,20 Z">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="20s"
            repeatCount="indefinite"
          />
        </path>
        <circle cx="50" cy="50" r="15" fill="currentColor"/>
      </svg>

      {/* Gear 2 - bottom left */}
      <svg 
        className="absolute bottom-20 left-20 w-24 h-24 text-primary-600 animate-spin-reverse"
        style={{ animationDuration: '15s' }}
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M50,15 L53,23 L61,22 L59,30 L67,33 L62,40 L67,47 L59,50 L61,58 L53,57 L50,65 L47,57 L39,58 L41,50 L33,47 L38,40 L33,33 L41,30 L39,22 L47,23 Z">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="360 50 50"
            to="0 50 50"
            dur="15s"
            repeatCount="indefinite"
          />
        </path>
        <circle cx="50" cy="50" r="12" fill="currentColor"/>
      </svg>

      {/* Gear 3 - middle right */}
      <svg 
        className="absolute top-1/2 right-32 w-20 h-20 text-primary-500/60 animate-spin-slow"
        style={{ animationDuration: '25s' }}
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M50,20 L52,26 L58,25 L57,31 L63,33 L60,38 L63,43 L57,45 L58,51 L52,50 L50,56 L48,50 L42,51 L43,45 L37,43 L40,38 L37,33 L43,31 L42,25 L48,26 Z">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="25s"
            repeatCount="indefinite"
          />
        </path>
        <circle cx="50" cy="50" r="10" fill="currentColor"/>
      </svg>
    </div>
  );
}

