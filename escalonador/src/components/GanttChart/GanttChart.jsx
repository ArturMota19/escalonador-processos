import React, { useState, useEffect } from "react";
import ProcessSubtitle from "../ProcessSubtitle/ProcessSubtitle";
// Styles
import s from "./GanttChart.module.css";

export default function GanttChart({ schedulerMatrix, schedulerType, delay }) {
  const barHeight = 30;
  const barPadding = 10;
  const labelPadding = 100;
  const colors = {
    default: "#3498db",
    overload: "#e74c3c",
    deadlineFinished: "#000000",
    waiting: "#F1C40F",
  };

  const maxTime = schedulerMatrix.reduce(
    (max, process) =>
      Math.max(max, ...process.segments.map((segment) => segment.endTime)),
    0
  );
  const chartHeight = (barHeight + barPadding) * schedulerMatrix.length + 60;
  const chartWidth =
    document.getElementById("window").clientWidth - 2 * labelPadding;

  const [currentMaxTime, setCurrentMaxTime] = useState(0);

  useEffect(() => {
    let intervalTime = delay * 1000;
    const interval = setInterval(() => {
      setCurrentMaxTime((prev) => Math.min(prev + 1, maxTime));
      if (currentMaxTime >= maxTime) {
        clearInterval(interval);
      }
    }, intervalTime);
    return () => clearInterval(interval);
  }, [currentMaxTime, maxTime, delay]);

  const getFillColor = (segment) => {
    if (segment.isOverload) {
      return colors.overload;
    } else if (segment.isDeadlineFinished) {
      return colors.deadlineFinished;
    } else if (segment.isWaiting) {
      return colors.waiting;
    } else {
      return colors.default;
    }
  };

  return (
    <>
      <svg
        className={s.ganttChartWrapper}
        width={chartWidth + labelPadding}
        height={chartHeight}
      >
        {schedulerMatrix.map((process, index) => (
          <g key={process.id}>
            {process.segments.map((segment, segmentIndex) => {
              if (segment.startTime > currentMaxTime) {
                return null;
              }

              const barWidth =
                ((Math.min(segment.endTime, currentMaxTime) -
                  segment.startTime) /
                  maxTime) *
                chartWidth;
              const x =
                (segment.startTime / maxTime) * chartWidth + labelPadding;
              const y = index * (barHeight + barPadding);

              return (
                <rect
                  key={segmentIndex}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={getFillColor(segment)}
                  stroke="#000"
                  strokeWidth="1"
                />
              );
            })}
            <text
              className={s.processName}
              x={labelPadding - 5}
              y={index * (barHeight + barPadding) + barHeight / 2}
              dy=".35em"
              textAnchor="end"
              fill="#000"
            >
              {`Processo ${process.id}`}
            </text>
          </g>
        ))}
        {[...Array(currentMaxTime + 1)].map((_, i) => (
          <text
            key={i}
            x={(i / maxTime) * chartWidth + labelPadding - 5}
            y={chartHeight - 15}
            dy=".71em"
            textAnchor="middle"
            fill="#000"
          >
            {i}
          </text>
        ))}
      </svg>
      <ProcessSubtitle colors={colors} schedulerType={schedulerType} />
    </>
  );
}
