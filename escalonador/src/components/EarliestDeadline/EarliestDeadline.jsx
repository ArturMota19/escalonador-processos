// Imports
import { useEffect, useState } from "react";
// Styles
import s from "./EarliestDeadline.module.css";
import GanttChart from "../GanttChart/GanttChart";

export default function EarliestDeadline({
  quantum,
  overload,
  processes,
  setReset,
  delay,
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
            return b.firstArrivalTime - a.firstArrivalTime;
          }
          return a.deadline - b.deadline;
        })
        .map((process, index) => ({
          ...process,
          arrivalTime: index,
          firstArrivalTime: process.arrival,
          segments: [],
        }));

      setEdfProcesses([...sortedProcesses]);
    }
  }, [processes, quantum, overload]);

  // Função para iniciar o EDF
  const startEDF = () => {
    if (edfProcesses.length > 0) {
      setReset(false);
      setStartScheduler(true);
      const processesCopy = [...edfProcesses]; // Cópia dos processos ordenados

      let currentTime = 0;
      const sortedProcesses = processesCopy
        .filter((process) => process.status === "Waiting")
        .sort((a, b) => {
          if (a.deadline === b.deadline) {
            return a.time - b.time;
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
          // sortedProcesses.forEach((p) => {
          //   if (p.time > 0 && p.arrival <= currentTime) {
          //     p.segments.push({
          //       startTime: currentTime - 1,
          //       endTime: currentTime,
          //       isOverload: false,
          //       isDeadlineFinished: false,
          //       isWaiting: true,
          //     });
          //   }
          // });
          currentTime++;
          continue;
        }

        const startTime = currentTime;

        // Adicionar segmento de espera
        if (
          process.segments.length === 0
          // process.segments[process.segments.length - 1].endTime !== startTime
        ) {
          process.segments.push({
            startTime: process.arrival,
            endTime: startTime,
            isOverload: false,
            isDeadlineFinished: false,
            isWaiting: true,
          });
        }

        let remainingTime = process.time;
        const realDeadline =
          parseInt(process.deadline) + parseInt(process.arrival);

        if (remainingTime > quantum) {
          remainingTime -= quantum;
          const endTime = parseInt(startTime) + parseInt(quantum);
          const overloadStartTime = endTime;
          const overloadEndTime =
            parseInt(overloadStartTime) + parseInt(overload);

          currentTime = overloadEndTime;
          if (realDeadline === startTime) {
            processMap.get(process.id).segments.push({
              startTime: startTime,
              endTime: endTime,
              isOverload: false,
              isDeadlineFinished: true,
            });
          } else if (realDeadline < endTime && realDeadline > startTime) {
            const DeadlineFinished = parseInt(realDeadline);
            processMap.get(process.id).segments.push({
              startTime: startTime,
              endTime: DeadlineFinished,
              isOverload: false,
              isDeadlineFinished: false,
            });
            processMap.get(process.id).segments.push({
              startTime: DeadlineFinished,
              endTime: endTime,
              isOverload: false,
              isDeadlineFinished: true,
            });
          } else if (realDeadline < startTime) {
            processMap.get(process.id).segments.push({
              startTime,
              endTime,
              isOverload: false,
              isDeadlineFinished: true,
            });
          } else {
            processMap.get(process.id).segments.push({
              startTime,
              endTime,
              isOverload: false,
              isDeadlineFinished: false,
            });
          }

          process.time = remainingTime;

          processMap.get(process.id).segments.push({
            startTime: overloadStartTime,
            endTime: overloadEndTime,
            isOverload: true,
            isDeadlineFinished: false,
            isWaiting: false,
          });

          sortedProcesses.sort((a, b) => {
            if (a.deadline === b.deadline) {
              return a.time - b.time;
            }
            return a.deadline - b.deadline;
          });
        } else {
          const endTime = parseInt(startTime) + parseInt(remainingTime);
          currentTime = endTime;

          if (realDeadline < endTime && realDeadline > startTime) {
            const DeadlineFinished = parseInt(realDeadline);

            processMap.get(process.id).segments.push({
              startTime: startTime,
              endTime: DeadlineFinished,
              isOverload: false,
              isDeadlineFinished: false,
            });
            processMap.get(process.id).segments.push({
              startTime: DeadlineFinished,
              endTime: endTime,
              isOverload: false,
              isDeadlineFinished: true,
            });
          } else if (realDeadline <= startTime) {
            processMap.get(process.id).segments.push({
              startTime,
              endTime,
              isOverload: false,
              isDeadlineFinished: true,
            });
          } else {
            processMap.get(process.id).segments.push({
              startTime,
              endTime,
              isOverload: false,
              isDeadlineFinished: false,
            });
          }

          process.time = 0;
          processMap.get(process.id).endTime = endTime;
        }

        // Adiciona segmento de espera após a execução se houver tempo ocioso
        sortedProcesses.forEach((p) => {
          if (p.time > 0 && p !== process && p.arrival <= currentTime) {
            const lastSegment = p.segments[p.segments.length - 1];
            if (lastSegment && lastSegment.endTime < currentTime) {
              p.segments.push({
                startTime: lastSegment.endTime,
                endTime: currentTime,
                isOverload: false,
                isDeadlineFinished: false,
                isWaiting: true,
              });
            }
          }
        });
      }

      const turnAroundTimes = Array.from(processMap.values()).map((process) => {
        const arrivalTime = process.arrival;
        const completionTime =
          process.segments[process.segments.length - 1].endTime;
        return completionTime - arrivalTime;
      });

      const totalTurnAroundTime = turnAroundTimes.reduce(
        (acc, value) => acc + value,
        0
      );
      const averageTurnAroundTime = (
        totalTurnAroundTime / turnAroundTimes.length
      ).toFixed(2);

      setTurnAroundTime(averageTurnAroundTime);
      setSchedulerMatrix(Array.from(processMap.values()));
    }
  };

  // Função para resetar o EDF
  const resetEDF = () => {
    setStartScheduler(false);
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
          <div class="turnaround">
        <p>TurnAround: {turnAroundTime}</p>
</div>
          <GanttChart
            schedulerMatrix={schedulerMatrix}
            schedulerType="EDF"
            delay={delay}
          />
        </div>
      )}
    </div>
  );
}
