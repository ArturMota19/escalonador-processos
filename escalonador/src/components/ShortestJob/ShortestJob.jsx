// Components

// Images

// Imports

// Styles
import s from './ShortestJob.module.css';

export default function ShortestJob({quantum, overload, selectedPagination, pagination}) {
  return (
    <div>
      <h1>ShortestJob Componente</h1>
      <p>Quantum: {quantum}</p>
      <p>Overload: {overload}</p>
      <p>Pagination: {pagination}</p>
      <p>SelectedPagination: {selectedPagination}</p>
    </div>
  );
}