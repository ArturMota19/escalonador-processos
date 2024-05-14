// Components

// Images

// Imports

// Styles
import s from './EarliestDeadline.module.css';

export default function EarliestDeadline({quantum, overload, selectedPagination, pagination}) {
  return (
    <div>
      <h1>EarliestDeadline Componente</h1>
      <p>Quantum: {quantum}</p>
      <p>Overload: {overload}</p>
      <p>Pagination: {pagination}</p>
      <p>SelectedPagination: {selectedPagination}</p>
    </div>
  );
}