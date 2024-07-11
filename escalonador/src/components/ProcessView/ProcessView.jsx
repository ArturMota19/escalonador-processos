// Images
import closeIcon from "../../assets/close-icon.png";
// Styles
import s from "./ProcessView.module.css";

export default function ProcessView({ processes, setProcesses }) {
  const handleAddNewProcess = () => {
    setProcesses([
      ...processes,
      {
        id: processes.length + 1,
        time: 1,
        deadline: 0,
        arrival: 0,
        priority: 0,
        status: "Waiting",
      },
    ]);
  };
  const handleRemove = (id) => {
    return () => {
      setProcesses(
        processes
          .filter((process) => process.id !== id)
          .map((process, index) => ({ ...process, id: index + 1 }))
      );
    };
  };
  const handleInputChange = (id, field, value) => {
    setProcesses(
      processes.map((process) => {
        if (process.id === id) {
          return {
            ...process,
            [field]: parseInt(value),
          };
        }
        return process;
      })
    );
  };
  return (
    <section className={s.processViewWrapper}>
      <div onClick={handleAddNewProcess} className={s.addProcessBtn}>
        <p>Criar processo</p>
      </div>
      {processes.length === 0 ? (
        <p className={s.noProcess}>Nenhum processo criado</p>
      ) : (
        processes.map((process) => (
          <div key={process.id} className={s.eachProcess}>
            <div className={s.closeBtn}>
              <p>ID {process.id}</p>
              <img
                src={closeIcon}
                alt="ícone para deletar o processo"
                onClick={handleRemove(process.id)}
              />
            </div>
            <div className={s.twoInputs}>
              <label>
                Prioridade:
                <input
                  type="number"
                  name="processPriority"
                  value={process.priority}
                  onChange={(e) =>
                    handleInputChange(process.id, "priority", e.target.value)
                  }
                />
              </label>
              <label>
                Tempo:
                <input
                  type="number"
                  name="processTime"
                  value={process.time}
                  onChange={(e) =>
                    handleInputChange(process.id, "time", e.target.value)
                  }
                />
              </label>
            </div>
            <div className={s.twoInputs}>
              <label>
                Deadline:
                <input
                  type="number"
                  name="processDeadline"
                  value={process.deadline}
                  onChange={(e) =>
                    handleInputChange(process.id, "deadline", e.target.value)
                  }
                />
              </label>
              <label>
                Chegada:
                <input
                  type="number"
                  name="processArrival"
                  value={process.arrival}
                  onChange={(e) =>
                    handleInputChange(process.id, "arrival", e.target.value)
                  }
                />
              </label>
            </div>
          </div>
        ))
      )}
    </section>
  );
}
