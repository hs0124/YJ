
import React from 'react';
import { getHormoneLevels } from '../utils/cycleLogic';

interface CycleCurveProps {
  currentDay: number;
  cycleLength: number;
}

const CycleCurve: React.FC<CycleCurveProps> = ({ currentDay, cycleLength }) => {
  const points = 60;
  const estrogenPoints: string[] = [];
  const progesteronePoints: string[] = [];
  const width = 1000;
  const height = 120;
  const padding = 20;

  for (let i = 0; i <= points; i++) {
    const day = (i / points) * cycleLength + 1;
    const { estrogen, progesterone } = getHormoneLevels(day, cycleLength);
    const x = (i / points) * width;
    const ey = height - padding - (estrogen * (height - padding * 2));
    const py = height - padding - (progesterone * (height - padding * 2));
    estrogenPoints.push(`${x},${ey}`);
    progesteronePoints.push(`${x},${py}`);
  }

  const indicatorX = ((currentDay - 1) / cycleLength) * width;

  return (
    <div className="relative w-full h-[140px] mt-4 mb-2 group">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        {/* Background Gradients */}
        <defs>
          <linearGradient id="estrogenGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="progesteroneGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Areas */}
        <path
          d={`M0,${height} L${estrogenPoints.join(' L')} L${width},${height} Z`}
          fill="url(#estrogenGradient)"
        />
        <path
          d={`M0,${height} L${progesteronePoints.join(' L')} L${width},${height} Z`}
          fill="url(#progesteroneGradient)"
        />

        {/* Lines */}
        <polyline
          fill="none"
          stroke="#f43f5e"
          strokeWidth="3"
          strokeLinecap="round"
          points={estrogenPoints.join(' ')}
          className="opacity-60"
        />
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          points={progesteronePoints.join(' ')}
          className="opacity-40"
        />

        {/* Current Day Indicator */}
        <line
          x1={indicatorX}
          y1="0"
          x2={indicatorX}
          y2={height}
          stroke="#94a3b8"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <circle
          cx={indicatorX}
          cy={height - padding - (getHormoneLevels(currentDay, cycleLength).estrogen * (height - padding * 2))}
          r="6"
          fill="#f43f5e"
          className="shadow-lg"
        />
      </svg>
      
      <div className="absolute top-0 left-0 flex gap-4 text-[10px] font-bold uppercase tracking-widest px-2">
        <div className="flex items-center gap-1 text-rose-500">
          <div className="w-2 h-2 rounded-full bg-rose-500"></div> 雌激素 (Estrogen)
        </div>
        <div className="flex items-center gap-1 text-blue-500">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div> 孕激素 (Progesterone)
        </div>
      </div>
    </div>
  );
};

export default CycleCurve;
