// Components
import Header from './components/Header/Header'
// Images
import logo from '/logo.png';
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
        </div>
      </section>
    </main>
  )
}

export default App
