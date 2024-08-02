import React from "react";
// Styles
import s from "./ProcessSubtitle.module.css";

export default function ProcessSubtitle({ colors, schedulerType }) {
  const subtitleItems = schedulerType === "FIFO" || schedulerType === "SJF" ? [
    { color: colors.default, label: "Executado" },
    { color: colors.waiting, label: "Esperando" },
  ] : [
    { color: colors.default, label: "Executado" },
    { color: colors.overload, label: "Sobrecarga" },
    { color: colors.deadlineFinished, label: "Deadline Acabou" },
    { color: colors.waiting, label: "Esperando" },
  ]

  return (
    <div className={s.subtitle}>
      {subtitleItems.map((item, index) => (
        <div key={index} className={s.subtitleItem}>
          <div
            className={s.colorBox}
            style={{ backgroundColor: item.color }}
          ></div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
