import React from "react";

import axios from "axios";

const API_URL = 'http://localhost:8081/api/balance';

export const getBalances = async () => {
    const response = await axios.get(`${API_URL}/getBalances`);
    return response.data;
}

export const getProductbalance = async (id: string) => {
    const response = await axios.get(`${API_URL}/getProductbalance/${id}`);
    return response.data;
}

