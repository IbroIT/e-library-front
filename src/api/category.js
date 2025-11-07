import axios from 'axios';

const API_URL = 'https://su-library-back-d2d8d21af2e4.herokuapp.com/api/categories';

export const getCategories = () => axios.get(API_URL);