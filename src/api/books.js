import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://su-library-back-d2d8d21af2e4.herokuapp.com/api';
const API_URL = `${API_BASE}/books`;

// Debug: Log API URL
console.log('API_BASE:', API_BASE);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

export const getBooks = (categoryIds = []) => {
  const params = {};
  if (categoryIds.length > 0) {
    params.categories = categoryIds.join(',');
  }
  return axios.get(`${API_URL}`, { params });
};

export const getBookDetails = (id) => axios.get(`${API_URL}/${id}`);