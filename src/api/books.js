import axios from 'axios';

const API_URL = 'http://localhost:8000/api/books';

export const getBooks = (categoryIds = []) => {
  const params = {};
  if (categoryIds.length > 0) {
    params.categories = categoryIds.join(',');
  }
  return axios.get(`${API_URL}`, { params });
};

export const getBookDetails = (id) => axios.get(`${API_URL}/${id}`);