// Components

// Images

// Imports
import { useEffect, useState } from "react";
// Styles
import s from "./EarliestDeadline.module.css";
import GanttChart from "../GanttChart/GanttChart";

export default function EarliestDeadline({
  quantum,
  overload,
  selectedPagination,
  pagination,
  processes,
  setRamProcesses,
  setReset,
}) {
  // Estados do componente
  const [startScheduler, setStartScheduler] = useState(false);
  const [turnAroundTime, setTurnAroundTime] = useState(0);
  const [edfProcesses, setEdfProcesses] = useState([]);
  const [schedulerMatrix, setSchedulerMatrix] = useState([]);

  // Efeito para ordenar os processos inicialmente
  useEffect(() => {
    if (processes.length > 0) {
      const sortedProcesses = processes
        .filter((process) => process.status === "Waiting")
        .sort((a, b) => {
          if (a.deadline === b.deadline) {
            return a.arrival - b.arrival;
          }
          return a.deadline - b.deadline;
        })
        .map((process, index) => ({
          ...process,
          arrivalTime: index,
        }));

      setEdfProcesses(sortedProcesses);
    }
  }, [processes]);

  // Função para iniciar o EDF
  const startEDF = () => {
    if (processes.length > 0) {
      setReset(false);
      setStartScheduler(true);
      setRamProcesses(edfProcesses);

      let currentTime = 0;
      const sortedProcesses = processes
        .filter((process) => process.status === "Waiting")
        .sort((a, b) => {
          if (a.deadline === b.deadline) {
            return a.arrival - b.arrival;
          }
          return a.deadline - b.deadline;
        });

      const newSchedulerMatrix = [];
      let processQueue = [...sortedProcesses];

      while (processQueue.length > 0) {
        const process = processQueue.shift();
        const startTime = Math.max(currentTime, process.arrival);
        let remainingTime = process.time;

        if (remainingTime > quantum) {
          remainingTime -= quantum;
          const endTime = parseInt(startTime) + parseInt(quantum);
          const overloadStartTime = endTime;
          const overloadEndTime = parseInt(overloadStartTime) + overload;
          console.log("startTime:", startTime);
          console.log("quantum:", quantum);
          console.log("endTime:", endTime);

          currentTime = overloadEndTime;

          // Atualizando deadline e tempo do processo
          // IMPORTANTE
          // process.deadline -= (quantum + overload); IMPORTANTE
          process.time = remainingTime;

          // Adiciona o período de execução e sobrecarga ao schedulerMatrix
          newSchedulerMatrix.push({ id: process.id, startTime, endTime });
          newSchedulerMatrix.push({
            id: `overload-${process.id}`,
            startTime: overloadStartTime,
            endTime: overloadEndTime,
            isOverload: true,
          });

          // Reordena os processos pela deadline atualizada
          processQueue.push(process);
          processQueue.sort((a, b) => {
            if (a.deadline === b.deadline) {
              return a.arrival - b.arrival;
            }
            return a.deadline - b.deadline;
          });
        } else {
          const endTime = +startTime + remainingTime;
          currentTime = endTime;
          newSchedulerMatrix.push({ id: process.id, startTime, endTime });
        }
      }

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

  // Função para resetar o EDF
  const resetEDF = () => {
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
          onClick={startEDF}
          className={startScheduler ? s.disabledBtn : s.startBtn}
          disabled={startScheduler}
        >
          Iniciar
        </button>
        <button onClick={resetEDF} className={s.resetBtn}>
          Reset
        </button>
      </div>
      {startScheduler && (
        <div>
          <p>TurnAround: {turnAroundTime}</p>
          <GanttChart schedulerMatrix={schedulerMatrix} schedulerType="EDF" />
        </div>
      )}
    </div>
  );
}
