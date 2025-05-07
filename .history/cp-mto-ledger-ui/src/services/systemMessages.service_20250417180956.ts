import axios from 'axios';

export const getSystemMessages = async () => {
  try {
    const response = await axios.get('/api/messages/system-messages');
    return response.data;
  } catch (error) {
    console.error('Error fetching system messages:', error);
    throw error;
  }
}