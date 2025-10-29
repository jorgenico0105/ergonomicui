import React, { useRef } from 'react';

const FileUpload = ({ currentType, selectedFile, onFileSelect, onFileRemove }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSelectFile(file);
    }
  };

  const validateAndSelectFile = (file) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (currentType === 'ergonomico' && !isImage) {
      alert('Por favor selecciona una imagen');
      return;
    }

    if (currentType === 'postural' && !isVideo) {
      alert('Por favor selecciona un video');
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSelectFile(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('dragover');
  };

  const fileType = currentType === 'ergonomico' ? 'imagen' : 'video';
  const acceptType = currentType === 'ergonomico' ? 'image/*' : 'video/*';

  return (
    <section className="upload-section">
      <h2>Subir Archivo</h2>

      {!selectedFile ? (
        <div
          className="upload-area"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptType}
            hidden
            onChange={handleFileChange}
          />
          <div className="upload-content">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <p className="upload-text">
              Toca para seleccionar <span>{fileType}</span>
            </p>
            <small className="upload-hint">o arrastra el archivo aquí</small>
          </div>
        </div>
      ) : (
        <div className="preview-area">
          <div className="preview-header">
            <span>{selectedFile.name}</span>
            <button className="btn-remove" onClick={onFileRemove}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="preview-content">
            {selectedFile.type.startsWith('image/') ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="result-image"
              />
            ) : (
              <video src={URL.createObjectURL(selectedFile)} controls />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default FileUpload;
