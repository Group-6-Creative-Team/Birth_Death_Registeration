// paymentService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:9000/api'; // Adjust based on your setup

// Fetch all payment methods
export const getPaymentMethods = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/payment-methods`);
        return response.data;
    } catch (error) {
        console.error("Error fetching payment methods:", error);
        throw error;
    }
};

// Create a new payment record
export const createPayment = async (paymentData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/payments`, paymentData);
        return response.data;
    } catch (error) {
        console.error("Error creating payment:", error);
        throw error;
    }
};



// paymentService.js
export const updatePaymentStatus = async (data) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/payments/status`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating payment status:", error);
        throw error;
    }
};
