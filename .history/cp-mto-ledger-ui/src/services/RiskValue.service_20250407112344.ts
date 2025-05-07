import React from "react";
import axios from "axios";

const API_URL = 'http://localhost:8081/api/risk-value';

export const createRiskValue  = async (payload : any) => {
    try {
        const response = await axios.post(`${API_URL}/create`, {
        payload
        });
        return response.data;
    } catch (error) {
        console.error('Error creating risk value:', error);
        throw error;
    }
}

export const getRiskValues = async () => {
    try {
        const response = await axios.get(`${API_URL}/getRiskValues`);
        return response.data;
    } catch (error) {
        console.error('Error fetching risk values:', error);
        throw error;
    }
}