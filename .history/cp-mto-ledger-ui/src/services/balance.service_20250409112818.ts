import React from "react";
import axios from "axios";

const API_URL = 'http://localhost:8081/api/balances';

export interface BalanceResponse {
    productId: number;
    productName: string;
    balance: number;
    dateUpdate: string;
    status: string;
}

export const getRecentBalances = async (): Promise<BalanceResponse[]> => {
    const response = await axios.get(`${API_URL}/recent`);
    return response.data;
}

export const getBalanceByProductId = async (productId: number): Promise<BalanceResponse> => {
    const response = await axios.get(`${API_URL}/product/${productId}`);
    return response.data;
}

