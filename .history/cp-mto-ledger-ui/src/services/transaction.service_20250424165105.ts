import axios from 'axios';

const API_URL = 'http://localhost:8081/api/transaction';


export const getValidatedTransactions = async () => {
  try {
    const response = await axios.get(`${API_URL}/getCompeletedTrans`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

