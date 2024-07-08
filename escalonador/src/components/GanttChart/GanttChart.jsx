import React, { useState, useEffect } from "react";
// Styles
import s from "./GanttChart.module.css";

export default function GanttChart({ schedulerMatrix, schedulerType }) {
  const barHeight = 30;
  const barPadding = 10;
  const labelPadding = 100;
  const colors = {
    default: "#3498db",
    overload: "#e74c3c",
    deadlineFinished: "#000000",
  };

  const maxTime = schedulerMatrix.reduce((max, process) => Math.max(max, ...process.segments.map((segment) => segment.endTime)), 0);
  const chartHeight = (barHeight + barPadding) * schedulerMatrix.length + 60;
  const chartWidth = 800;

  const [currentMaxTime, setCurrentMaxTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMaxTime((time) => time + 1);
      if (currentMaxTime >= maxTime) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentMaxTime, maxTime]);

  const getFillColor = (segment) => {
    if (segment.isOverload) {
      return colors.overload;
    } else if (segment.isDeadlineFinished) {
      return colors.deadlineFinished;
    } else {
      return colors.default;
    }
  };

  return (
    <svg className={s.ganttChartWrapper} width={chartWidth + labelPadding} height={chartHeight}>
      {schedulerMatrix.map((process, index) => (
        <g key={process.id}>
          {process.segments.map((segment, segmentIndex) => {
            if (segment.startTime > currentMaxTime) {
              return null;
            }

            const barWidth = ((Math.min(segment.endTime, currentMaxTime) - segment.startTime) / maxTime) * chartWidth;
            const x = (segment.startTime / maxTime) * chartWidth + labelPadding;
            const y = index * (barHeight + barPadding);

            return <rect key={segmentIndex} x={x} y={y} width={barWidth} height={barHeight} fill={getFillColor(segment)} stroke="#000" strokeWidth="1" />;
          })}
          <text className={s.processName} x={labelPadding - 5} y={index * (barHeight + barPadding) + barHeight / 2} dy=".35em" textAnchor="end" fill="#000">
            {`Processo ${process.id}`}
          </text>
        </g>
      ))}
      {[...Array(currentMaxTime + 1)].map((_, i) => (
        <text key={i} x={(i / maxTime) * chartWidth + labelPadding - 5} y={chartHeight - 15} dy=".71em" textAnchor="middle" fill="#000">
          {i}
        </text>
      ))}
    </svg>
  );
}
