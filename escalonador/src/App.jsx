// Components
import Header from "./components/Header/Header";
import ProcessView from "./components/ProcessView/ProcessView";
import Fifo from "./components/Fifo/Fifo";
import RoundRobin from "./components/RoundRobin/RoundRobin";
import ShortestJob from "./components/ShortestJob/ShortestJob";
import EarliestDeadline from "./components/EarliestDeadline/EarliestDeadline";
// Images

// Imports
import { useEffect, useState } from "react";
// Styles
import s from "./App.module.css";

function App() {
  // Wrapper geral do projeto
  // State para seleção de método
  const [selectedButton, setSelectedButton] = useState(0); // 0, 1, 2, 3
  // State para Quantum
  const [quantum, setQuantum] = useState(1);
  // State para Sobrecarga
  const [overload, setOverload] = useState(1);
  // State para o delay
  const [delay, setDelay] = useState(1);
  // State array para criação de processos
  const [processes, setProcesses] = useState([
    {
      id: 1,
      time: 1,
      deadline: 0,
      arrival: 0,
      priority: 0,
      status: "Waiting",
    },
  ]);
  const [reset, setReset] = useState(false);

  return (
    <main className={s.wrapperMain}>
      <h2 className={s.titleName}>Escalonador de Processos - Trabalho MATA58</h2>
      <p className={s.weNames}>Desenvolvido pelos Alunos Artur Mota, Bruna Anunciação, João Gabriel Lofiego e Victoria Beatriz.</p>
      <section className={s.internDiv} id="window">
        <div className={s.scrollView}>
          <Header
            selectedButton={selectedButton}
            setSelectedButton={setSelectedButton}
            quantum={quantum}
            setQuantum={setQuantum}
            overload={overload}
            setOverload={setOverload}
            delay={delay}
            setDelay={setDelay}
          />
          <div className={s.line} />
          <ProcessView processes={processes} setProcesses={setProcesses} />
          <div className={s.line} />
          {selectedButton === 0 && <EarliestDeadline quantum={quantum} overload={overload} processes={processes} setReset={setReset} delay={delay} />}
          {selectedButton === 1 && <RoundRobin quantum={quantum} overload={overload} processes={processes} setReset={setReset} delay={delay} />}
          {selectedButton === 2 && <Fifo quantum={quantum} overload={overload} processes={processes} setReset={setReset} delay={delay} />}
          {selectedButton === 3 && <ShortestJob quantum={quantum} overload={overload} processes={processes} setReset={setReset} delay={delay} />}
          <div className={s.line} />
        </div>
      </section>
    </main>
  );
}

export default App;
