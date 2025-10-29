import React from 'react';

const LoadingState = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p className="loading-text">Procesando análisis...</p>
      <small className="loading-hint">Esto puede tomar unos momentos</small>
    </div>
  );
};

export default LoadingState;
