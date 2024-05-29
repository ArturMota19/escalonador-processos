import { useEffect, useState } from "react";
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
          segments: [],
        }));

      setEdfProcesses([...sortedProcesses]);
    }
  }, [processes]);

  // Função para iniciar o EDF
  const startEDF = () => {
    if (edfProcesses.length > 0) {
      setReset(false);
      setStartScheduler(true);
      const processesCopy = [...edfProcesses]; // Cópia dos processos ordenados
      setRamProcesses(processesCopy); // Passa a cópia para o estado

      let currentTime = 0;
      const sortedProcesses = processesCopy
        .filter((process) => process.status === "Waiting")
        .sort((a, b) => {
          if (a.deadline === b.deadline) {
            return a.arrival - b.arrival;
          }
          return a.deadline - b.deadline;
        });

      const processMap = new Map(
        sortedProcesses.map((process) => [process.id, { ...process }])
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
        let remainingTime = process.time;

        if (remainingTime > quantum) {
          remainingTime -= quantum;
          const endTime = parseInt(startTime) + parseInt(quantum);
          const overloadStartTime = endTime;
          const overloadEndTime = parseInt(overloadStartTime) + overload;

          currentTime = overloadEndTime;

          // if (process.deadline < endTime) {
          //   const startFinishedDeadlineTime = process.deadline + 1;
          //   const endFinishedDeadlineTime = endTime;

          //   processMap.get(process.id).segments.push({
          //     startTime: startFinishedDeadlineTime,
          //     endTime: endFinishedDeadlineTime,
          //     isOverload: false,
          //     isDeadlineFinished: true,
          //     status: "DeadlineFinished",
          //   });
          // }

          process.time = remainingTime;

          // Adiciona o período de execução e sobrecarga aos segmentos do processo
          processMap.get(process.id).segments.push({
            startTime,
            endTime,
            isOverload: false,
            status: process.status,
            deadline: process.deadline,
          });
          processMap.get(process.id).segments.push({
            startTime: overloadStartTime,
            endTime: overloadEndTime,
            isOverload: true,
            status: process.status,
            deadline: process.deadline,
          });

          // Reordena os processos pela deadline atualizada
          sortedProcesses.sort((a, b) => {
            if (a.deadline === b.deadline) {
              return a.arrival - b.arrival;
            }
            return a.deadline - b.deadline;
          });
        } else {
          const endTime = parseInt(startTime) + remainingTime;
          currentTime = endTime;

          // if (process.deadline < endTime) {
          //   const startFinishedDeadlineTime = parseInt(process.deadline) + 1;
          //   const endFinishedDeadlineTime = endTime;
          //   console.log('oi')

          //   processMap.get(process.id).segments.push({
          //     startTime: startFinishedDeadlineTime,
          //     endTime: endFinishedDeadlineTime,
          //     isOverload: false,
          //     isDeadlineFinished: true,
          //     status: "DeadlineFinished",
          //   });
          // }
          process.time = 0;

          processMap.get(process.id).segments.push({
            startTime,
            endTime,
            isOverload: false,
            status: process.status,
            deadline: process.deadline,
          });
        }
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

  // Função para resetar o EDF
  const resetEDF = () => {
    setStartScheduler(false);
    setRamProcesses([...edfProcesses]);
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
