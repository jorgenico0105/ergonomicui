import { useState } from 'react';
import AnalysisTypeSelector from './components/AnalysisTypeSelector';
import FileUpload from './components/FileUpload';
import LoadingState from './components/LoadingState';
import Results from './components/Results';
import { analyzeImage, analyzeVideo } from './services/api';
import { createPdf, downloadPdf } from './utils/pdfGenerator';
import './App.css';

function App() {
  const [currentType, setCurrentType] = useState('ergonomico');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [showUpload, setUpload] = useState(true);

  const handleTypeChange = (type) => {
    setCurrentType(type);
    setSelectedFile(null);
    setAnalysisResults(null);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setAnalysisResults(null);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert('Por favor selecciona un archivo');
      return;
    }

    setIsLoading(true);
    setAnalysisResults(null);

    try {
      let results;
      if (currentType === 'ergonomico') {
        results = await analyzeImage(selectedFile);
      } else {
        results = await analyzeVideo(selectedFile);
      }
      setUpload(false)
      setAnalysisResults(results);
      const pdfBytes = await createPdf(results);
      console.log('PDF generado:', pdfBytes);

    } catch (error) {
      console.error('Error en el análisis:', error);

      let errorMessage = 'Error al procesar el análisis';

      // Usar el mensaje personalizado del error si existe
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response) {
        // Error del servidor con respuesta
        errorMessage = error.response.data?.error ||
                      error.response.data?.message ||
                      `Error del servidor: ${error.response.status}`;
        console.log('Server error:', error.response);
      } else if (error.request) {
        // Error de red sin respuesta
        errorMessage = 'No se pudo conectar con el servidor. El servidor puede estar en modo sleep (Render free tier). Espera 1 minuto e intenta de nuevo.';
        console.log('Network error:', error.request);
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!analysisResults) {
      alert('No hay resultados para descargar');
      return;
    }

    try {
      const pdfBytes = await createPdf(analysisResults);
      downloadPdf(pdfBytes, `reporte-${analysisResults.id || 'analisis'}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF');
    }
  };

  const handleNewAnalysis = () => {
    setSelectedFile(null);
    setAnalysisResults(null);
    setUpload(true);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Mediciones Antropométricas</h1>
        <p>Evaluación ergonómica y postural</p>
      </header>

      <AnalysisTypeSelector
        currentType={currentType}
        onTypeChange={handleTypeChange}
      />
      {showUpload && <FileUpload
        currentType={currentType}
        selectedFile={selectedFile}
        onFileSelect={handleFileSelect}
        onFileRemove={handleFileRemove}
      />

      }
      {showUpload && <button
        className="btn-analyze"
        onClick={handleAnalyze}
        disabled={!selectedFile || isLoading}
      >
        Analizar
      </button>}


      <LoadingState isLoading={isLoading} />

      <Results
        results={analysisResults}
        onDownloadPdf={handleDownloadPdf}
        onNewAnalysis={handleNewAnalysis}
      />
    </div>
  );
}

export default App;
