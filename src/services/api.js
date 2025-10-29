import axios from 'axios';

const API_BASE_URL = 'https://ergonomic-poses-2.onrender.com';

export const API_ENDPOINTS = {
  ergonomico: `${API_BASE_URL}/api/analisis-ergonomico/analyze`,
  postural: `${API_BASE_URL}/api/analisis-postural/analizar-postura`
};

export const analyzeImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axios.post(API_ENDPOINTS.ergonomico, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  console.log(response.data)
  return response.data;
};

export const analyzeVideo = async (file) => {
  const formData = new FormData();
  formData.append('video', file);

  const response = await axios.post(API_ENDPOINTS.postural, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};
