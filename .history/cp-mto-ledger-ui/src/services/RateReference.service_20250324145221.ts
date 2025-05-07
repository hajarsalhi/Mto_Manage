import React from "react";
import axios from "axios";

const API_URL = 'http://localhost:8081/api/rateReference';

export const updateRateReference = async (currency: string, rate: number , dateStart : Date , dateEnd :Date) => {
    try {
        const response = await axios.put(`${API_URL}/update`, { rate,currency,dateStart,dateEnd });
        return response.data;
    } catch (error) {
        console.error('Error updating rate reference:', error);
        throw error;
    }
}