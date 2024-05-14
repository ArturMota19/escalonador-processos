// Components
import Header from './components/Header/Header'
import Fifo from './components/Fifo/Fifo'
import RoundRobin from './components/RoundRobin/RoundRobin'
import ShortestJob from './components/ShortestJob/ShortestJob'
import EarliestDeadline from './components/EarliestDeadline/EarliestDeadline'
// Images

// Imports
import { useState } from 'react'
// Styles
import s from  './App.module.css'

function App() {
  // Wrapper geral do projeto
  // State para seleção de método
  const [selectedButton, setSelectedButton] = useState(0) // 0, 1, 2, 3
  // State para Paginação
  const [selectedPagination, setSelectedPagination] = useState(0) // 0, 1
  // State para Quantum
  const [quantum, setQuantum] = useState(1)
  // State para Sobrecarga
  const [overload, setOverload] = useState(1)
  // State paginação
  const [pagination, setPagination] = useState(1)
  // State array para criação de processos
  const [processes, setProcesses] = useState([])
  const exemploArray = [{id: 0, tempo: 0, deadline: 0, chegada: 0, prioridade: 0, paginas: 0, status: 'Waiting'}]

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
          <div className={s.line}/>
          {selectedButton === 0 && <EarliestDeadline quantum={quantum} overload={overload} selectedPagination={selectedPagination} pagination={pagination} />}
          {selectedButton === 1 && <RoundRobin  quantum={quantum} overload={overload} selectedPagination={selectedPagination} pagination={pagination}/>}
          {selectedButton === 2 && <Fifo  quantum={quantum} overload={overload} selectedPagination={selectedPagination} pagination={pagination}/>}
          {selectedButton === 3 && <ShortestJob quantum={quantum} overload={overload} selectedPagination={selectedPagination} pagination={pagination}/>}
        </div>
      </section>
    </main>
  )
}

export default App
