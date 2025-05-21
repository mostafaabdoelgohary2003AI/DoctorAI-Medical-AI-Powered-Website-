import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data', // Default for image uploads
  },
});

// API calls for each model
export const predictBoneFracture = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/bone_fracture', formData);
  return response.data;
};

export const predictLungColon = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/lung_colon', formData);
  return response.data;
};

export const predictMonkeypox = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/monkeypox', formData);
  return response.data;
};

export const predictSkinCancer = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/skin_cancer', formData);
  return response.data;
};

export const predictTumor = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/tumor', formData);
  return response.data;
};

export const predictXray = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/xray', formData);
  return response.data;
};

export const predictPalmDisease = async (features: number[]) => {
  const response = await api.post('/api/palm_disease', features, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const predictChatbot = async (text: string) => {
  const response = await api.post('/api/chatbot', { text }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};