// Imports
import { useEffect, useState } from "react";
// Styles
import s from "./Disk.module.css";

export default function Disk({ processes, memoryFull, reset }) {
  const [disk, setDisk] = useState(
    Array.from({ length: 6 }, () => Array(10).fill("*"))
  );
  const updateDisk = (processes) => {
    const newDisk = Array.from({ length: 6 }, () => Array(10).fill("*"));
    let currentCell = 0;

    processes.forEach((process) => {
      let remainingSize = process.pages;
      while (remainingSize > 0 && currentCell < 60) {
        const row = Math.floor(currentCell / 10);
        const col = currentCell % 10;
        if (newDisk[row][col] === "*") {
          newDisk[row][col] = process.id;
          remainingSize--;
        }
        currentCell++;
      }
      if (remainingSize > 0) {
        memoryFull(true);
      }
    });
    setDisk(newDisk);
  };
  const resetDisk = () => {
    setDisk(Array.from({ length: 6 }, () => Array(10).fill("*")));
  };
  useEffect(() => {
    if (reset) {
      resetDisk();
    }
  }, [reset]);
  useEffect(() => {
    updateDisk(processes);
  }, [processes, memoryFull]);
  return (
    <section className={s.diskWrapper}>
      <h1>Disco</h1>
      {disk.map((row, i) => (
        <div key={i} className={s.diskRow}>
          {row.map((cell, j) => (
            <div key={j} className={s.diskCell}>
              {cell}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
