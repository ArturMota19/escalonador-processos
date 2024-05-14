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
  return (
    <main className={s.wrapperMain}>
      <div className={s.internDiv}>
        <Header 
          selectedButton={selectedButton} 
          setSelectedButton={setSelectedButton}
        />
      </div>
    </main>
  )
}

export default App
