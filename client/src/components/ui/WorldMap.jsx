import { motion } from 'framer-motion';

const connectionPoints = [
  { x: 18, y: 35, label: 'San Francisco' },
  { x: 25, y: 30, label: 'New York' },
  { x: 48, y: 28, label: 'London' },
  { x: 52, y: 32, label: 'Dubai' },
  { x: 65, y: 38, label: 'Mumbai' },
  { x: 68, y: 35, label: 'Bangalore' },
  { x: 78, y: 40, label: 'Singapore' },
  { x: 85, y: 48, label: 'Sydney' },
  { x: 55, y: 25, label: 'Berlin' },
  { x: 82, y: 30, label: 'Tokyo' },
];

const connections = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
  [2, 4], [0, 4], [5, 9], [2, 8],
];

export default function WorldMap({ className = '' }) {
  return (
    <div className={`relative w-full aspect-[2/1] ${className}`}>
      <svg
        viewBox="0 0 100 60"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simplified world map outline */}
        <g opacity="0.15" fill="none" stroke="#60a5fa" strokeWidth="0.3">
          {/* North America */}
          <path d="M10,20 Q15,15 22,18 L28,22 Q30,28 25,35 L20,38 Q12,35 10,28 Z" />
          {/* South America */}
          <path d="M22,42 Q27,40 28,45 L26,55 Q23,58 20,55 L19,48 Z" />
          {/* Europe */}
          <path d="M44,18 Q48,15 52,17 L54,22 Q52,26 48,28 L44,25 Z" />
          {/* Africa */}
          <path d="M46,30 Q50,28 54,32 L52,45 Q48,50 46,45 Z" />
          {/* Asia */}
          <path d="M55,15 Q65,12 78,18 L82,28 Q80,35 70,38 L60,35 Q55,28 55,22 Z" />
          {/* Oceania */}
          <path d="M78,42 Q85,40 90,45 L88,52 Q82,54 78,48 Z" />
        </g>

        {/* Grid lines */}
        <g opacity="0.05" stroke="#3b82f6" strokeWidth="0.2">
          {[15, 25, 35, 45].map((y) => (
            <line key={`h${y}`} x1="5" y1={y} x2="95" y2={y} />
          ))}
          {[20, 35, 50, 65, 80].map((x) => (
            <line key={`v${x}`} x1={x} y1="10" x2={x} y2="55" />
          ))}
        </g>

        {/* Connection lines */}
        {connections.map(([from, to], i) => (
          <motion.line
            key={i}
            x1={connectionPoints[from].x}
            y1={connectionPoints[from].y}
            x2={connectionPoints[to].x}
            y2={connectionPoints[to].y}
            stroke="url(#lineGradient)"
            strokeWidth="0.3"
            strokeDasharray="2,2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Location dots */}
        {connectionPoints.map((point, i) => (
          <g key={i}>
            {/* Pulse ring */}
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="0"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="0.3"
              initial={{ r: 0, opacity: 0.6 }}
              animate={{ r: 3, opacity: 0 }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeOut',
              }}
            />
            {/* Dot */}
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="0.8"
              fill="#60a5fa"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
            />
            {/* Glow */}
            <circle
              cx={point.x}
              cy={point.y}
              r="1.5"
              fill="#3b82f6"
              opacity="0.2"
            />
          </g>
        ))}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
