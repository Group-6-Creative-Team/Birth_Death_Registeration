import axios from 'axios';

const BASE_URL = 'http://localhost:9000/api/payment-methods';; // Adjust if your backend API route is different

// Create a new payment method
export const createPaymentMethod = async (methodData) => {
    try {
        const response = await axios.post(`${BASE_URL}/`, methodData);
        return response.data;
    } catch (error) {
        console.error("Error creating payment method:", error.response?.data || error.message);
        throw error;
    }
};

// Get all payment methods
export const getAllPaymentMethods = async () => {
    try {
        const response = await axios.get(`${BASE_URL}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching payment methods:", error.response?.data || error.message);
        throw error;
    }
};

// Get a single payment method by ID
export const getPaymentMethodById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching payment method:", error.response?.data || error.message);
        throw error;
    }
};

// Update a payment method by ID
export const updatePaymentMethod = async (id, methodData) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, methodData);
        return response.data;
    } catch (error) {
        console.error("Error updating payment method:", error.response?.data || error.message);
        throw error;
    }
};

// Delete a payment method by ID
export const deletePaymentMethod = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting payment method:", error.response?.data || error.message);
        throw error;
    }
};
