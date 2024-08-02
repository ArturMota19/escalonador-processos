// Components

// Images

// Imports
import { useEffect, useState } from "react";
import GanttChart from "../GanttChart/GanttChart";

// Styles
import s from "./RoundRobin.module.css";

export default function RoundRobin({ quantum, overload, processes, setReset, delay }) {
  const [startScheduler, setStartScheduler] = useState(false);
  const [turnAroundTime, setTurnAroundTime] = useState(0);
  const [rrProcesses, setrrProcesses] = useState([]);
  const [schedulerMatrix, setSchedulerMatrix] = useState([]);

  useEffect(() => {
    if (processes.length > 0) {
      const sortedProcesses = processes
        .filter((process) => process.status === "Waiting")
        .sort((a, b) => {
          if (a.arrival == b.arrival) {
            return b.firstArrivalTime - a.firstArrivalTime;
          }
          return a.arrival - b.arrival;
        })
        .map((process, index) => ({
          ...process,
          arrivalTime: index,
          firstArrivalTime: process.arrival,
          segments: [],
        }));

      setrrProcesses([...sortedProcesses]);
    }
  }, [processes, quantum, overload]);

  const startRR = () => {
    if (processes.length > 0) {
      setReset(false);
      setStartScheduler(true);
      const processesCopy = [...rrProcesses]; // Cópia dos processos ordenados

      let currentTime = 0;
      let sortedProcesses = processes
        .filter((process) => process.status === "Waiting")
        .sort((a, b) => {
          if (a.arrival == b.arrival) {
            return b.firstArrivalTime - a.firstArrivalTime;
          }
          return a.arrival - b.arrival;
        })
        .map((process, index) => ({
          ...process,
          arrivalTime: index,
          firstArrivalTime: process.arrival,
          segments: [],
        }));

      setrrProcesses([...sortedProcesses]);

      while (rrProcesses.some((process) => process.time > 0)) {
        rrProcesses.sort((a, b) => {
          if (a.arrival == b.arrival) {
            return b.firstArrivalTime - a.firstArrivalTime;
          }
          return a.arrival - b.arrival;
        });
        const process = rrProcesses.find((p) => p.time > 0 && p.arrival <= currentTime);
        if (!process) {
          currentTime++;
          continue;
        }

        const startTime = parseInt(currentTime);

        process.segments.push({
          startTime: process.arrival,
          endTime: startTime,
          isOverload: false,
          isDeadlineFinished: false,
          isWaiting: true,
        });

        let remainingTime = parseInt(process.time);
        let endTime = startTime + Math.min(quantum, remainingTime);
        remainingTime -= parseInt(quantum);

        process.segments.push({
          startTime: startTime,
          endTime: endTime,
          isOverload: false,
          isDeadlineFinished: false,
        });

        if (remainingTime > 0) {
          process.segments.push({
            startTime: endTime,
            endTime: endTime + parseInt(overload),
            isOverload: true,
            isDeadlineFinished: false,
          });
          currentTime = endTime + parseInt(overload);
          process.arrival = currentTime;
        } else {
          remainingTime = 0;
          currentTime = endTime;
          process.finalEndTime = currentTime;
        }

        process.time = parseInt(remainingTime);

        sortedProcesses.sort((a, b) => {
          if (a.arrival == b.arrival) {
            return b.firstArrivalTime - a.firstArrivalTime;
          }
          return a.arrival - b.arrival;
        });
        setrrProcesses([...sortedProcesses]);
      }

      rrProcesses.sort((a, b) => {
        if (a.arrival == b.arrival) {
          return b.firstArrivalTime - a.firstArrivalTime;
        }
        return a.arrivalTime - b.arrivalTime;
      });
      setSchedulerMatrix(rrProcesses);

      setTurnAroundTime(rrProcesses.reduce((acc, value) => acc + (value.finalEndTime - value.firstArrivalTime) / rrProcesses.length, 0).toFixed(2));
    }
  };

  const resetRR = () => {
    setStartScheduler(false);
    setTurnAroundTime(0);
    setReset(true);
    setSchedulerMatrix([]);
  };

  return (
    <div className={s.sjfWrapper}>
      <div className={s.btnWrapper}>
        <button onClick={startRR} className={startScheduler ? s.disabledBtn : s.startBtn} disabled={startScheduler}>
          Iniciar
        </button>
        <button onClick={resetRR} className={s.resetBtn}>
          Reset
        </button>
      </div>
      {startScheduler && (
        <div>
          <div class="turnaround">
        <p>TurnAround: {turnAroundTime}</p>
</div>
          <GanttChart schedulerMatrix={schedulerMatrix} schedulerType="RR" delay={delay} />
        </div>
      )}
    </div>
  );
}
