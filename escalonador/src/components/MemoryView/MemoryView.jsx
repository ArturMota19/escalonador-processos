import Disk from './Disk/Disk';
import s from './MemoryView.module.css';
import Ram from './Ram/Ram';

export default function MemoryView({processes}) {
    return (
        <section className={s.memoryViewWrapper}>
            <Disk />
            <Ram />
        </section>
    )
}