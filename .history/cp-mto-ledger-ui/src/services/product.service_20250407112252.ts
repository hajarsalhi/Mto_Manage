import axios from "axios";
import React from "react";

const API_URL = 'http://localhost:8081/api/product';



export const getProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/getProducts`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Products:', error);
        throw error;
    }
}

export const getProductDevise = async (id : number) => {

    try {
        const response = await axios.get(`${API_URL}/${id}/getDevise`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Products Devise:', error);
        throw error;
    }

}