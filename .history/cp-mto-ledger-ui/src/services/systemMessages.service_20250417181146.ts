import axios from 'axios';

const API_URL = 'http://localhost:8081/api/messages';


export const getSystemMessages = async () => {
  try {
    const response = await axios.get(`${API_URL}/system-messages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching system messages:', error);
    throw error;
  }
}