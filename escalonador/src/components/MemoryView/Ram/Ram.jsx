// Imports
import { useState } from "react";
// Styles
import s from "./Ram.module.css";

export default function Ram() {
  const [ram, setRam] = useState(Array.from({length: 5}, () => Array(10).fill('*')));
  return (
    <section className={s.ramWrapper}>
      <h1>RAM</h1>
      {ram.map((row, i) => (
            <div key={i} className={s.ramRow}>
              {row.map((cell, j) => (
                <div key={j} className={s.ramCell}>
                  {cell}
                </div>
              ))}
            </div>
        ))}
    </section>
  );
}
