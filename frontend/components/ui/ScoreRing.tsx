interface ScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

const sizes = {
  sm:  { px: 36, stroke: 3.5, text: 'text-[10px]' },
  md:  { px: 48, stroke: 4,   text: 'text-xs' },
  lg:  { px: 64, stroke: 5,   text: 'text-sm' },
  xl:  { px: 96, stroke: 6,   text: 'text-xl' },
};

export function getScoreColor(score: number): string {
  if (score >= 70) return '#10b981';
  if (score >= 45) return '#f59e0b';
  return '#ef4444';
}

export function ScoreRing({ score, size = 'md', showLabel = false }: ScoreRingProps) {
  const { px, stroke, text } = sizes[size];
  const radius = (px - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: px, height: px }}>
        <svg
          width={px}
          height={px}
          className="-rotate-90"
          viewBox={`0 0 ${px} ${px}`}
          aria-label={`ICP Score: ${score}`}
        >
          <circle
            cx={px / 2}
            cy={px / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={stroke}
          />
          <circle
            cx={px / 2}
            cy={px / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center font-bold ${text}`}
          style={{ color }}
        >
          {score}
        </span>
      </div>
      {showLabel && <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Score</span>}
    </div>
  );
}
