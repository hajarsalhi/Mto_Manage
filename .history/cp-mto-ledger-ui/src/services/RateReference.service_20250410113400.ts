import React from "react";
import axios from "axios";

const API_URL = 'http://localhost:8081/api/rateReference';

export interface RateData {
  id?: number;
  currency: string;
  rate: number;
  date?: string;
}

export const getReferenceRates = async (): Promise<RateData[]> => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reference rates:', error);
    throw error;
  }
};

export const updateRateReference = async (currency: string, rate: number): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/update`, {
      currency,
      rate,
      source: 'MANUAL'
    });
    return response.data;
  } catch (error) {
    console.error('Error updating reference rate:', error);
    throw error;
  }
};

export const getRateReference = async () => {
    try {
        const response = await axios.get(`${API_URL}/getLatest`);
        return response.data;
    } catch (error) {
        console.error('Error fetching rate reference:', error);
        throw error;
    }
}