// Components
import Disk from './Disk/Disk';
import Ram from './Ram/Ram';
// Imports
import { useState } from 'react';
// Styles
import s from './MemoryView.module.css';

export default function MemoryView({processes, reset}) {
    const [memoryFull, setMemoryFull] = useState(false);
    const [remainingProcesses, setRemainingProcesses] = useState([]);
    return (
        <section className={s.memoryViewWrapper}>
            <Disk memoryFull={memoryFull} processes={remainingProcesses} reset={reset}/>
            <Ram processes={processes} setMemoryFull={setMemoryFull} setRemainingProcesses={setRemainingProcesses} reset={reset}/>
        </section>
    )
}