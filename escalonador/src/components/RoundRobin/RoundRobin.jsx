// Components

// Images

// Imports
import { useEffect, useState } from "react";
// Styles
import s from "../ShortestJob/ShortestJob.module.css";
import GanttChart from "../GanttChart/GanttChart";

export default function RoundRobin({ quantum, overload, selectedPagination, pagination, processes, setRamProcesses, setReset }) {
  const [startScheduler, setStartScheduler] = useState(false);
  const [turnAroundTime, setTurnAroundTime] = useState(0);
  const [rrProcesses, setrrProcesses] = useState([]);
  const [schedulerMatrix, setSchedulerMatrix] = useState([]);

  useEffect(() => {
    if (processes.length > 0) {
      // const sortedProcesses = processes
      //   .filter((process) => process.status === "Waiting")
      //   .sort((a, b) => {
      //     return a.arrival - b.arrival;
      //   })
      //   .map((process, index) => ({
      //     ...process,
      //     arrivalTime: index,
      //   }));

      setrrProcesses(processes);
    }
  }, [processes]);

  const startSJF = () => {
    if (processes.length > 0) {
      setReset(false);
      setStartScheduler(true);
      setRamProcesses(rrProcesses);

      let currentTime = 0;

      let newSchedulerMatrix = [];

      while (processes.length > 0) {
        processes.map((process) => {
          const startTime = Math.max(currentTime, process.arrival);
          const endTime = startTime + Math.min(quantum, process.time);
          currentTime = endTime;
          process.time -= quantum;
          processes = processes.slice(1, processes.length);

          if (process.time <= 0) {
            process.time = 0;
          } else {
            processes.push(process);
          }

          newSchedulerMatrix.push({ id: process.id, startTime, endTime });
          console.log(newSchedulerMatrix);
        });
        // newSchedulerMatrix = processes.map((process) => {
        //   const startTime = Math.max(currentTime, process.arrival);
        //   const endTime = startTime + Math.min(quantum, process.time);
        //   currentTime = endTime;
        //   process.time -= quantum;

        //   if (process.time < 0) {
        //     process.time = 0;
        //   }

        //   return { id: process.id, startTime, endTime };
        // });
      }
      setTurnAroundTime((newSchedulerMatrix.reduce((acc, process) => acc + (process.endTime - process.startTime), 0) / newSchedulerMatrix.length).toFixed(2));

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
        <button onClick={startSJF} className={startScheduler ? s.disabledBtn : s.startBtn} disabled={startScheduler}>
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
