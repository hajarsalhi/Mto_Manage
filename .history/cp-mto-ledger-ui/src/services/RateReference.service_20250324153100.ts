import React from "react";
import axios from "axios";

const API_URL = 'http://localhost:8081/api/rateReference';

export const updateRateReference = async (currency: string, rate: number) => {
    try {
        const response = await axios.post(`${API_URL}/update`, { rate,currency});
        return response.data;
    } catch (error) {
        console.error('Error updating rate reference:', error);
        throw error;
    }
}


export const getRateReference = async () => {
    try {
        const response = await axios.get(`${API_URL}/getRateReference`);
        return response.data;
    } catch (error) {
        console.error('Error fetching rate reference:', error);
        throw error;
    }
}