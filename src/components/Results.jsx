import React from 'react';

const Results = ({ results, onDownloadPdf, onNewAnalysis }) => {
  if (!results) return null;

  return (
    <section className="results-section">
      <h2>Analisis ergonomico</h2>
      <div className="results-content">
         <img src={results.data.image_url} alt="formated" className='img-formated'/> 
      </div>
      <button className="btn-download" onClick={onDownloadPdf}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Descargar Reporte PDF
      </button>
      <button className="btn-new" onClick={onNewAnalysis}>
        Nuevo Análisis
      </button>
    </section>
  );
};

export default Results;
