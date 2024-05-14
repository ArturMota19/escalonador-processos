// Components

// Images
import logo from '/logo.png';
// Imports

// Styles
import s from './Header.module.css';

export default function Header({selectedButton, setSelectedButton}) {
  return (
    <section className={s.wrapperHeader}>
      <img src={logo} alt='computacao ufba'/>
      <div className={s.displayMethod}>
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
      </div>
    </section>
  );
}