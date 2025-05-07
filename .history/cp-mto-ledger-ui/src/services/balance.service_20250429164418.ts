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

export interface BalanceForDashBoardRequest {
    productId: number;
    productName: string;
    realTimeBalance: number;
    balanceJ_1: number;
    
    dateUpdate: string;
    status: string;
    riskValue: number;
}

export interface CorrectionData {
    id: number;
    date: string;
    mtoName: string;
    mtoId: number;
    oldBalance: number;
    correction: number;
    motif: string;
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

export const getBalanceForDashboard = async (): Promise<BalanceForDashBoardRequest[]> => {
    try {
        const response = await axios.get(`${API_URL}/dashboard`);
        return response.data;
    } catch (error) {
        console.error('Error fetching balance for dashboard:', error);
        throw error;
    }
}

export const getHistoriesOfTransactionsAndCompensationsByProductId = async (productId: number): Promise<Record<string, any[]>> => {
    try {
        const response = await axios.get(`${API_URL}/transactions-compensations-history/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching transaction and compensation histories:', error);
        throw error;
    }
}

export const editCurrentBalance =  async(balanceId: number,correctionAmount: number ,newBalance: number, reason: string): Promise<BalanceResponse> => {
    try {
        const response = await axios.post(`${API_URL}/edit/${balanceId}`, {
            correctionAmount,
            newBalance,
            reason
        });
        return response.data;
    } catch (error) {
        console.error('Error editing current balance:', error);
        throw error;
    }
}

export const getCorrections = async(): Promise<CorrectionData[]>=> {

}


