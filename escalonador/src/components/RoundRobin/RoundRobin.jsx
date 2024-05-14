// Components

// Images

// Imports

// Styles
import s from './RoundRobin.module.css';

export default function RoundRobin({quantum, overload, selectedPagination, pagination}) {
  return (
    <div>
      <h1>RoundRobin Componente</h1>
      <p>Quantum: {quantum}</p>
      <p>Overload: {overload}</p>
      <p>Pagination: {pagination}</p>
      <p>SelectedPagination: {selectedPagination}</p>
    </div>
  );
}