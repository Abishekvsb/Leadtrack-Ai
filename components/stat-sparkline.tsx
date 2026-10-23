"use client";

import React from "react";

interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  fillGradient?: boolean;
}

export function StatSparkline({
  data,
  color = "#D62828",
  width = 80,
  height = 24,
  fillGradient = true,
}: SparklineProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pointsArray = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - 4) + 2;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return { x, y };
  });

  const points = pointsArray.map((p) => `${p.x},${p.y}`).join(" ");

  // Closed area polygon for gradient fill
  const first = pointsArray[0];
  const last = pointsArray[pointsArray.length - 1];
  const areaPoints = `${points} ${last.x},${height} ${first.x},${height}`;

  const gradId = `sparkline-grad-${Math.random().toString(36).substring(2, 8)}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      {fillGradient && (
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>
      )}
      {fillGradient && (
        <polygon fill={`url(#${gradId})`} points={areaPoints} />
      )}
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
