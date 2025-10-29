import React from 'react';

const AnalysisTypeSelector = ({ currentType, onTypeChange }) => {
  return (
    <section className="analysis-type">
      <h2>Tipo de Análisis</h2>
      <div className="type-buttons">
        <button
          className={`type-btn ${currentType === 'ergonomico' ? 'active' : ''}`}
          onClick={() => onTypeChange('ergonomico')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <span>Análisis Ergonómico</span>
          <small>Sube una imagen</small>
        </button>

        <button
          className={`type-btn ${currentType === 'postural' ? 'active' : ''}`}
          onClick={() => onTypeChange('postural')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="23 7 16 12 23 17 23 7"></polygon>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
          </svg>
          <span>Análisis Postural</span>
          <small>Sube un video</small>
        </button>
      </div>
    </section>
  );
};

export default AnalysisTypeSelector;
