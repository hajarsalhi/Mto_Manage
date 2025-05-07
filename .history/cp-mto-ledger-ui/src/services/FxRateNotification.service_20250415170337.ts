import axios from "axios";

const API_URL = 'http://localhost:8081/api/fx-rate-notifications';

export const fetchFxRateNotifications = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/getFxRateNotifications`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching FX rate notifications:", error);
    throw error;
  }
}

export const enableFxRateNotification = async (notificationId: number) => {
  try {
    const response = await axios.post(
      `${API_URL}/enableFxRateNotification`,
      { notificationId }
    );
    return response.data;
  } catch (error) {
    console.error("Error enabling FX rate notification:", error);
    throw error;
  }
}