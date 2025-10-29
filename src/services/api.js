import axios from 'axios';

const API_BASE_URL = 'https://ergonomic-poses-2.onrender.com';

export const API_ENDPOINTS = {
  ergonomico: `${API_BASE_URL}/api/analisis-ergonomico/analyze`,
  postural: `${API_BASE_URL}/api/analisis-postural/analizar-postura`
};

// Configuración de Axios con timeout extendido para análisis largos
const createApiConfig = (timeout = 300000) => ({
  timeout, // 5 minutos por defecto
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  onUploadProgress: (progressEvent) => {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    console.log(`Upload progress: ${percentCompleted}%`);
  }
});

export const analyzeImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(
      API_ENDPOINTS.ergonomico,
      formData,
      createApiConfig()
    );
    console.log('Response received:', response.data);
    return response.data;
  } catch (error) {
    // Mejor manejo de errores
    if (error.code === 'ECONNABORTED') {
      throw new Error('El análisis tardó demasiado. El servidor puede estar en modo sleep. Intenta de nuevo en 30 segundos.');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Error de red. Verifica tu conexión o el servidor puede estar reiniciando. Intenta en 1 minuto.');
    }
    throw error;
  }
};

export const analyzeVideo = async (file) => {
  const formData = new FormData();
  formData.append('video', file);

  try {
    const response = await axios.post(
      API_ENDPOINTS.postural,
      formData,
      createApiConfig(600000) // 10 minutos para videos
    );
    console.log('Response received:', response.data);
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('El análisis de video tardó demasiado. Intenta con un video más corto.');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Error de red. El servidor puede estar en modo sleep. Intenta en 1 minuto.');
    }
    throw error;
  }
};
