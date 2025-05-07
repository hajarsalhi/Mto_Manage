import React from "react";
import axios from "axios";

const API_URL = 'http://localhost:8081/api/balance';

export interface BalanceResponse {
    productId: number;
    productName: string;
    balance: number;
    dateUpdate: string;
    status: string;
    balanceJ_1: number;
    compensationJ_1: number;
    transactionJ_1: number;
}

export const getRecentBalances = async (): Promise<BalanceResponse[]> => {
    try {
        const response = await axios.get(`${API_URL}/recent`);
        return response.data;
    } catch (error) {
        console.error('Error fetching recent balances:', error);
        throw error;
    }
}

export const getBalanceByProductId = async (productId: number): Promise<BalanceResponse> => {
    try {
        const response = await axios.get(`${API_URL}/product/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching balance by product ID:', error);
        throw error;
    }
}

export const getDayBeforeFinanceData = async (): Promise<BalanceResponse[]> => {
    try {
        const response = await axios.get(`${API_URL}/day-before`);
        return response.data;
    } catch (error) {
        console.error('Error fetching day-before data:', error);
        throw error;
    }
}

