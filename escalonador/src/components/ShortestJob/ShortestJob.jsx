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
    if (sjfProcesses.length > 0) {
      setReset(false);
      setStartScheduler(true);
      const processesCopy = [...sjfProcesses];
      setRamProcesses(processesCopy);
  
      let currentTime = 0;
      const sortedProcesses = processesCopy
        .filter((process) => process.status === "Waiting")
        .sort((a, b) => a.time - b.time);
  
      const processMap = new Map(
        sortedProcesses.map((process) => [process.id, { ...process, segments: [] }])
      );
  
      while (sortedProcesses.some((process) => process.time > 0)) {
        const process = sortedProcesses.find(
          (p) => p.time > 0 && p.arrival <= currentTime
        );
        if (!process) {
          currentTime++;
          continue;
        }
  
        const startTime = currentTime;
        const endTime = startTime + process.time;
        currentTime = endTime;
  
        processMap.get(process.id).segments.push({
          startTime,
          endTime,
          isOverload: false,
          isDeadlineFinished: false,
        });
  
        process.time = 0;
      }
  
      setTurnAroundTime(
        (
          Array.from(processMap.values()).reduce(
            (acc, process) =>
              acc +
              process.segments.reduce(
                (segAcc, segment) =>
                  segAcc + (segment.endTime - segment.startTime),
                0
              ),
            0
          ) / processMap.size
        ).toFixed(2)
      );
  
      setSchedulerMatrix(Array.from(processMap.values()));
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
