// Components

// Images

// Imports

// Styles
import s from './Fifo.module.css'

export default function Fifo({quantum, overload, selectedPagination, pagination}) {
  return (
    <div>
      <h1>Fifo Componente</h1>
      <p>Quantum: {quantum}</p>
      <p>Overload: {overload}</p>
      <p>Pagination: {pagination}</p>
      <p>SelectedPagination: {selectedPagination}</p>
    </div>
  );
}