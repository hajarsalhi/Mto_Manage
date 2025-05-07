import React from "react";
import axios from "axios";

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

export const getProductFinParamsById = async (id : number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}/finParams`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Product:', error);
        throw error;
    }   
}

export const updateProdctFinParams = async (id : number, productData : any) => {
    try {   
        const response = await axios.put(`${API_URL}/${id}/finParams`, productData);
        return response.data;
    } catch (error) {
        console.error('Error updating Product:', error);
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

export const createProduct = async (productData : any) => {
    try {
        const response = await axios.post(`${API_URL}/newProduct`, 
            productData
        );
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

export const getProductCommissions = async() =>{
    try {
        const response = await axios.get(`${API_URL}/getProductCommission`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Products:', error);
        throw error;
    }

}

export const getNewProducts = async() =>{
    try {
        const response = await axios.get(`${API_URL}/newProducts`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Products:', error);
        throw error;
    }

}