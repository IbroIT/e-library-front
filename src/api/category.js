import axios from 'axios';

const API_URL = 'http://localhost:8000/api/categories';

export const getCategories = () => axios.get(API_URL);