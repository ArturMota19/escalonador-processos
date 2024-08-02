// Imports
import { useEffect, useState } from "react";
// Styles
import s from "./Fifo.module.css";
import GanttChart from "../GanttChart/GanttChart";

export default function Fifo({
  quantum,
  overload,
  processes,
  setReset,
  delay
}) {
  const [startScheduler, setStartScheduler] = useState(false);
  const [turnAroundTime, setTurnAroundTime] = useState(0);
  const [fifoProcesses, setFifoProcesses] = useState([]);
  const [schedulerMatrix, setSchedulerMatrix] = useState([]);

  useEffect(() => {
    if (processes.length > 0) {
      const sortedProcesses = processes
        .filter((process) => process.status === "Waiting")
        .sort((a, b) => a.arrival - b.arrival)
        .map((process, index) => ({
          ...process,
          arrivalTime: index,
        }));

      setFifoProcesses(sortedProcesses);
    }
  }, [processes]);

  function callProcesses() {
    if (processes.length > 0) {
      const sortedProcesses = processes
        .filter((process) => process.status === "Waiting")
        .sort((a, b) => a.arrival - b.arrival)
        .map((process, index) => ({
          ...process,
          arrivalTime: index,
        }));

      setFifoProcesses(sortedProcesses);
    }
  }

  const startFIFO = () => {
    if (fifoProcesses.length > 0) {
      setReset(false);
      setStartScheduler(true);
      const processesCopy = [...fifoProcesses];

      let currentTime = 0;
      const processMap = new Map(
        processesCopy.map((process) => [process.id, { ...process, segments: [], completionTime: 0 }])
      );

      while (processesCopy.some((process) => process.time > 0)) {
        const process = processesCopy.find(
          (p) => p.time > 0 && p.arrival <= currentTime
        );
        if (!process) {
          currentTime++;
          continue;
        }

        // Add waiting segment if the process arrived before the current time
        if (process.arrival < currentTime) {
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

        processMap.get(process.id).completionTime = endTime;
        process.time = 0;
      }

      setTurnAroundTime(
        (
          Array.from(processMap.values()).reduce(
            (acc, process) =>
              acc + (process.completionTime - process.arrival),
            0
          ) / processMap.size
        ).toFixed(2)
      );

      setSchedulerMatrix(Array.from(processMap.values()));
    }
  };

  const resetFIFO = () => {
    setStartScheduler(false);
    setReset(true);
    setSchedulerMatrix([]);
    callProcesses();
  };

  return (
    <div className={s.fifoWrapper}>

      <div className={s.btnWrapper}>
        <button
          onClick={startFIFO}
          className={startScheduler ? s.disabledBtn : s.startBtn}
          disabled={startScheduler}
        >
          Iniciar
        </button>
        <button onClick={resetFIFO} className={s.resetBtn}>
          Reset
        </button>
      </div>
      {startScheduler && (
        <div>
          <div class="turnaround">
        <p>TurnAround: {turnAroundTime}</p>
</div>
          <GanttChart schedulerMatrix={schedulerMatrix} schedulerType="FIFO" delay={delay} />
        </div>
      )}
    </div>
  );
}
