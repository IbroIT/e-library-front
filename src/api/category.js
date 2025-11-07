import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/categories';

export const getCategories = () => axios.get(API_URL);