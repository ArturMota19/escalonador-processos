// Components

// Images

// Imports
import { useEffect, useState } from "react";
// Styles
import s from "./ShortestJob.module.css";
import GanttChart from "../GanttChart/GanttChart";

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
  const [sjfProcesses, setSjfProcesses] = useState([]);
  const [schedulerMatrix, setSchedulerMatrix] = useState([]);

  useEffect(() => {
    if (processes.length > 0) {
      const sortedProcesses = processes
        .filter((process) => process.status === "Waiting")
        .sort((a, b) => {
          if (a.arrival === b.arrival) {
            return a.time - b.time;
          }
          return a.arrival - b.arrival;
        })
        .map((process, index) => ({
          ...process,
          arrivalTime: index,
        }));

      setSjfProcesses(sortedProcesses);
    }
  }, [processes]);

  const startSJF = () => {
    if (processes.length > 0) {
      setReset(false);
      setStartScheduler(true);
      setRamProcesses(sjfProcesses);

      const sortedProcesses = sjfProcesses.sort((a, b) => {
        if (a.arrival === b.arrival) {
          return a.time - b.time;
        }
        return a.arrival - b.arrival;
      });

      let currentTime = 0;
      const newSchedulerMatrix = sortedProcesses.map((process) => {
        const startTime = Math.max(currentTime, process.arrival);
        const endTime = startTime + process.time;
        currentTime = endTime;
        return { id: process.id, startTime, endTime };
      });

      setTurnAroundTime(
        (
          newSchedulerMatrix.reduce(
            (acc, process) => acc + (process.endTime - process.startTime),
            0
          ) / newSchedulerMatrix.length
        ).toFixed(2)
      );

      setSchedulerMatrix(newSchedulerMatrix);
    }
  };

  const resetSJF = () => {
    setStartScheduler(false);
    setRamProcesses([]);
    setTurnAroundTime(0);
    setReset(true);
    setSchedulerMatrix([]);
  };

  return (
    <div className={s.sjfWrapper}>
      <div className={s.btnWrapper}>
        <button
          onClick={startSJF}
          className={startScheduler ? s.disabledBtn : s.startBtn}
          disabled={startScheduler}
        >
          Iniciar
        </button>
        <button onClick={resetSJF} className={s.resetBtn}>
          Reset
        </button>
      </div>
      {startScheduler && (
        <div>
          <p>TurnAround: {turnAroundTime}</p>
          <GanttChart schedulerMatrix={schedulerMatrix} schedulerType="SJF" />
        </div>
      )}
    </div>
  );
}
