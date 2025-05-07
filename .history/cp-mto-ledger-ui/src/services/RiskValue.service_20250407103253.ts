import React from "react";
import axios from "axios";

const API_URL = 'http://localhost:8080/api/risk-value';

export const createRiskValue  = async () => {
    try {
        const response = await axios.post('/api/risk-values/create', {
        // Your request payload here
        });
        return response.data;
    } catch (error) {
        console.error('Error creating risk value:', error);
        throw error;
    }
}