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
  processes,
  setReset,
  delay
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
          segments: [],
        }));

      setSjfProcesses(sortedProcesses);
    }
  }, [processes]);

  const startSJF = () => {
    if (sjfProcesses.length > 0) {
      setReset(false);
      setStartScheduler(true);
      const processesCopy = [...sjfProcesses];
  
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
  
        if (process.arrival <= currentTime && process.time > 0 && process.segments.length === 0) {
          processMap.get(process.id).segments.push({
            startTime: process.arrival,
            endTime: currentTime,
            isOverload: false,
            isDeadlineFinished: false,
            isWaiting: true,
          });
        }
  
        const startTime = currentTime;
        const endTime = startTime + process.time;
        currentTime = endTime;
  
        processMap.get(process.id).segments.push({
          startTime,
          endTime,
          isOverload: false,
          isDeadlineFinished: false,
          isWaiting: false,
        });
  
        process.time = 0;
      }
  
      const turnAroundTimes = Array.from(processMap.values()).map((process) => {
        const arrivalTime = process.arrival;
        const completionTime = process.segments[process.segments.length - 1].endTime;
        return completionTime - arrivalTime;
      });
  
      const totalTurnAroundTime = turnAroundTimes.reduce((acc, time) => acc + time, 0);
      const averageTurnAroundTime = (totalTurnAroundTime / turnAroundTimes.length).toFixed(2);
  
      setTurnAroundTime(averageTurnAroundTime);
  
      setSchedulerMatrix(Array.from(processMap.values()));
    }
  };

  const resetSJF = () => {
    setStartScheduler(false);
    setReset(true);
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
          <div class="turnaround">
        <p>TurnAround: {turnAroundTime}</p>
</div>
          <GanttChart schedulerMatrix={schedulerMatrix} schedulerType="SJF" delay={delay} />
        </div>
      )}
    </div>
  );
}
