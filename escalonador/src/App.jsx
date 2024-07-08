// Components
import Header from "./components/Header/Header";
import ProcessView from "./components/ProcessView/ProcessView";
import Fifo from "./components/Fifo/Fifo";
import RoundRobin from "./components/RoundRobin/RoundRobin";
import ShortestJob from "./components/ShortestJob/ShortestJob";
import EarliestDeadline from "./components/EarliestDeadline/EarliestDeadline";
import MemoryView from "./components/MemoryView/MemoryView";
// Images

// Imports
import { useEffect, useState } from "react";
// Styles
import s from "./App.module.css";

function App() {
  // Wrapper geral do projeto
  // State para seleção de método
  const [selectedButton, setSelectedButton] = useState(0); // 0, 1, 2, 3
  // State para Paginação
  const [selectedPagination, setSelectedPagination] = useState(0); // 0, 1
  // State para Quantum
  const [quantum, setQuantum] = useState(1);
  // State para Sobrecarga
  const [overload, setOverload] = useState(1);
  // State paginação
  const [pagination, setPagination] = useState(1);
  // State array para criação de processos
  const [processes, setProcesses] = useState([
    {
      id: 1,
      time: 1,
      deadline: 0,
      arrival: 0,
      priority: 0,
      pages: 1,
      status: "Waiting",
    },
  ]);
  const [ramProcesses, setRamProcesses] = useState([]);
  const [reset, setReset] = useState(false);

  return (
    <main className={s.wrapperMain}>
      <section className={s.internDiv}>
        <div className={s.scrollView}>
          <Header
            selectedButton={selectedButton}
            setSelectedButton={setSelectedButton}
            selectedPagination={selectedPagination}
            setSelectedPagination={setSelectedPagination}
            quantum={quantum}
            setQuantum={setQuantum}
            overload={overload}
            setOverload={setOverload}
            pagination={pagination}
            setPagination={setPagination}
          />
          <div className={s.line} />
          <ProcessView processes={processes} setProcesses={setProcesses} />
          <div className={s.line} />
          {selectedButton === 0 && (
            <EarliestDeadline
              quantum={quantum}
              overload={overload}
              selectedPagination={selectedPagination}
              pagination={pagination}
              processes={processes}
              setRamProcesses={setRamProcesses}
              setReset={setReset}
            />
          )}
          {selectedButton === 1 && (
            <RoundRobin
              quantum={quantum}
              overload={overload}
              selectedPagination={selectedPagination}
              pagination={pagination}
            />
          )}
          {selectedButton === 2 && (
            <Fifo
              quantum={quantum}
              overload={overload}
              selectedPagination={selectedPagination}
              pagination={pagination}
            />
          )}
          {selectedButton === 3 && (
            <ShortestJob
              quantum={quantum}
              overload={overload}
              selectedPagination={selectedPagination}
              pagination={pagination}
              processes={processes}
              setRamProcesses={setRamProcesses}
              setReset={setReset}
            />
          )}
          <div className={s.line} />
          <MemoryView processes={ramProcesses} reset={reset}/>
        </div>
      </section>
    </main>
  );
}

export default App;
