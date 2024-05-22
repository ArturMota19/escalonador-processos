// Imports
import { useEffect, useState } from "react";
// Styles
import s from "./Ram.module.css";

export default function Ram({processes, setMemoryFull, setRemainingProcesses, reset}) {
  const [ram, setRam] = useState(Array.from({length: 5}, () => Array(10).fill('*')));
  const updateRam = (processes) => {
    const newRam = Array.from({ length: 5 }, () => Array(10).fill('*'));
    let currentCell = 0;

    processes.forEach((process) => {
      let remainingSize = process.pages;
      while (remainingSize > 0 && currentCell < 50) {
        const row = Math.floor(currentCell / 10);
        const col = currentCell % 10;
        if (newRam[row][col] === '*') {
          newRam[row][col] = process.id;
          remainingSize--;
        }
        currentCell++;
      }
      if (remainingSize > 0) {
        setMemoryFull(true);
        setRemainingProcesses((prev) => [...prev, {
          ...process,
          pages: remainingSize,
        }]);
      }
    });
    setRam(newRam);
  };
  const resetRam = () => {
    setRam(Array.from({length: 5}, () => Array(10).fill('*')));
  };
  useEffect(() => {
    if (reset) {
      resetRam();
    }
  }, [reset]);
  useEffect(() => {
    updateRam(processes);
  }, [processes])
  return (
    <section className={s.ramWrapper}>
      <h1>RAM</h1>
      {ram.map((row, i) => (
            <div key={i} className={s.ramRow}>
              {row.map((cell, j) => (
                <div key={j} className={s.ramCell}>
                  {cell}
                </div>
              ))}
            </div>
        ))}
    </section>
  );
}
