import axios from 'axios';

const API_URL = 'https://e-library-back.onrender.com/api/categories';

export const getCategories = () => axios.get(API_URL);