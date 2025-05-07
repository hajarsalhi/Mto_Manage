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

export const enableFxRateNotification = async (notificationData: any) => {
  try {
    const response = await axios.post(
      `${API_URL}/enableFxRateNotification`,
      notificationData
    );
    return response.data;
  } catch (error) {
    console.error("Error enabling FX rate notification:", error);
    throw error;
  }
}

export const getFxRateNotificationStatus = async()=> {
  try {
    const response = await axios.get(
      `${API_URL}/status`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching FX rate notification status:", error);
    throw error;
  }
}