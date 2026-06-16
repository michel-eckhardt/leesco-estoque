export function Logo() {
  return (
    <div className="flex items-center gap-2">
      {/* OceanPact Logo - 3 Waves */}
      <svg
        viewBox="0 0 48 48"
        className="h-8 w-8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Wave */}
        <path
          d="M8 14 Q12 10 16 14 T24 14 T32 14 T40 14"
          stroke="#0369a1"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Middle Wave */}
        <path
          d="M6 22 Q10 18 14 22 T22 22 T30 22 T38 22"
          stroke="#0369a1"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Bottom Wave */}
        <path
          d="M10 30 Q14 26 18 30 T26 30 T34 30 T42 30"
          stroke="#0369a1"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="text-lg font-bold text-blue-600 hidden sm:inline">
        OceanPact
      </span>
    </div>
  );
}
