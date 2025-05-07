import React from "react";
import axios from "axios";

const API_URL = 'http://localhost:8081/api/balance';

export interface BalanceResponse {
    productId: number;
    productName: string;
    balance: number;
    dateUpdate: string;
    status: string;
    balanceJ1: number;
    compensationJ1: number;
    transactionsJ1: number;
    
}

export const getRecentBalances = async (): Promise<BalanceResponse[]> => {
    const response = await axios.get(`${API_URL}/recent`);
    return response.data;
}

export const getBalanceByProductId = async (productId: number): Promise<BalanceResponse> => {
    const response = await axios.get(`${API_URL}/product/${productId}`);
    return response.data;
}

