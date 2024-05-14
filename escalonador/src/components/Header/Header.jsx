// Components

// Images
import logo from '/logo.png';
import ufba from '/ufba.png'
// Imports

// Styles
import s from './Header.module.css';
import { useEffect } from 'react';

export default function Header({selectedButton, setSelectedButton, selectedPagination, setSelectedPagination, quantum, setQuantum, overload, setOverload, pagination, setPagination}) {
  // useEffect(() => {

  // },[quantum, setQuantum, overload, setOverload, pagination, setPagination])
  return (
    <header className={s.wrapperHeader}>
      <div className={s.wrapperLogos}>
        <img src={logo} alt='computacao ufba'/>
        <img src={ufba} alt='brasao ufba'/>
      </div>
      <section className={s.displayMethod}>
        <h1>Método:</h1>
        <ul className={s.methodSelection}>
          <li>
            <button 
              className={selectedButton == 0 ? s.selectedButton : s.notSelectedButton}
              onClick={() => setSelectedButton(0)}
            >EDF</button>
          </li>
          <li>
            <button 
              className={selectedButton == 1 ? s.selectedButton : s.notSelectedButton}
              onClick={() => setSelectedButton(1)}
            >RR</button>
          </li>
          <li>
            <button
              className={selectedButton == 2 ? s.selectedButton : s.notSelectedButton}
              onClick={() => setSelectedButton(2)}
            >FIFO</button>
          </li>
          <li>
            <button 
              className={selectedButton == 3 ? s.selectedButton : s.notSelectedButton}
              onClick={() => setSelectedButton(3)}
            >SJF</button>
          </li>
        </ul>
      </section>
      <section className={s.wrapperSettings}> 
        <div>
          <p>Quantum:</p>
          <input onChange={(e) => setQuantum(e.target.value)} value={quantum} className={s.inputStyle} type='number' min='1' max='100' step='1' />
        </div>
        <div>
          <p>Sobrecarga:</p>
          <input onChange={(e) => setOverload(e.target.value)} value={overload} className={s.inputStyle} type='number' min='1' max='100' step='1' />
        </div>
        <div className={s.wrapperPagination}>
          <p>Paginação:</p>
          <button
            className={selectedPagination == 0 ? s.selectedButton : s.notSelectedButton}
            onClick={() => setSelectedPagination(0)}
          >FIFO</button>
          <button
            className={selectedPagination == 1 ? s.selectedButton : s.notSelectedButton}
            onClick={() => setSelectedPagination(1)}
          >LRU</button>
          <div className={s.wrapperPaginationSeconds}>
            <input onChange={(e) => setPagination(parseFloat(e.target.value))} type="range" min="0.125" max="2" step={0.125} />
            <p>{pagination}s</p>
          </div>
        </div>
        
      </section>
    </header>
  );
}