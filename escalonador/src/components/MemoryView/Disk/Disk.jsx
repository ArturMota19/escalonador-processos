// Imports
import { useState } from "react";
// Styles
import s from './Disk.module.css';

export default function Disk() {
    const [disk, setDisk] = useState(Array.from({length: 6}, () => Array(10).fill('*')));
    return (
        <section className={s.diskWrapper}>
            <h1>Disco</h1>
            {disk.map((row, i) => (
                <div key={i} className={s.diskRow}>
                    {row.map((cell, j) => (
                        <div key={j} className={s.diskCell}>
                            {cell}
                        </div>
                    ))}
                </div>
            ))}
        </section>
    )
}