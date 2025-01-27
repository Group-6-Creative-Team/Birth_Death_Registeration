// import axios from 'axios';

// const API_URL = 'http://localhost:9000/api/users'; // Replace with your backend URL if different

// // Register a new user
// export const registerUser = async (userData) => {
//     try {
//         const response = await axios.post(`${API_URL}/register`, userData);
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || error.message;
//     }
// };

// // Login user



// export const loginUser = async (userData) => {
//     try {
//         const response = await axios.post(`${API_URL}/login`, userData, {
//             headers: { 'Content-Type': 'application/json' }
//         });
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || { message: 'Request failed' };
//     }
// };

// // Get user profile
// export const getUserProfile = async () => {
//     try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`${API_URL}/profile`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || error.message;
//     }
// };

// // Update user profile
// export const updateUserProfile = async (profileData) => {
//     try {
//         const token = localStorage.getItem('token');
//         const response = await axios.put(`${API_URL}/profile`, profileData, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || error.message;
//     }
// };

// // Get all users
// export const getAllUsers = async () => {
//     try {
//         const response = await axios.get(`${API_URL}`);
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || error.message;
//     }
// };


import axios from 'axios';

const API_URL = 'http://localhost:9000/api/users'; // Base URL for the user-related API endpoints

// Login User
export const loginUser = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });

    if (response.data) {
        // Save user data to localStorage (optional)
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

// Logout User
export const logoutUser = () => {
    localStorage.removeItem('user'); // Clear user data from localStorage
};

// Register New User (Admin Only)
export const registerUser = async (userData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`, // Pass admin's token for authentication
        },
    };

    const response = await axios.post(`${API_URL}/register`, userData, config);
    return response.data;
};

// Get User Profile
export const getUserProfile = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(`${API_URL}/profile`, config);
    return response.data;
};

// Update User Profile
export const updateUserProfile = async (userData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(`${API_URL}/profile`, userData, config);
    return response.data;
};

// Get All Users (Admin Only)
export const getAllUsers = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`, // Pass admin's token
        },
    };

    const response = await axios.get(API_URL, config);
    return response.data;
};
