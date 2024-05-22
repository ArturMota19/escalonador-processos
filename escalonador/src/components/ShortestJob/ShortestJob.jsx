// Components

// Images

// Imports
import { useEffect, useState } from "react";
// Styles
import s from "./ShortestJob.module.css";

export default function ShortestJob({
  quantum,
  overload,
  selectedPagination,
  pagination,
  processes,
  setRamProcesses,
  setReset,
}) {
  const [startScheduler, setStartScheduler] = useState(false);
  const [turnAroundTime, setTurnAroundTime] = useState(0);
  const [sjfProcesses, setSjfProcesses] = useState(() => {
    const processesCopy = [...processes];
    processesCopy.sort((a, b) => a.time - b.time);
    return processesCopy;
  });

  const startSJF = () => {
    setReset(false);
    setStartScheduler(true);
    setRamProcesses(sjfProcesses);
    setTurnAroundTime( sjfProcesses.reduce((acc, process) => acc + process.time, 0) / sjfProcesses.length );
 };
 const resetSJF = () => {
    setStartScheduler(false);
    setRamProcesses([]);
    setTurnAroundTime(0);
    setReset(true);
  }

  return (
    <div className={s.sjfWrapper}>
      <div className={s.btnWrapper}>
        <button onClick={startSJF} className={s.startBtn}>Iniciar</button>
        <button onClick={resetSJF} className={s.resetBtn}>Reset</button>
      </div>
      {startScheduler && (
        <div>
          <p>TurnAround: {turnAroundTime}</p>
        </div>
      )}
    </div>
  );
}
