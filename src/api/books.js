import axios from 'axios';

const API_URL = 'http://localhost:8000/api/books';

export const getBooks = () => axios.get(API_URL);

export const getBookDetails = (id) => axios.get(`${API_URL}/${id}`);