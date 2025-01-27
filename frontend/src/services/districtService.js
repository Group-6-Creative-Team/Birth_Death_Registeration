import axios from 'axios';

const API_URL = 'http://localhost:9000/api/districts'; // Adjust the base URL if necessary

// Create a new district
export const createDistrict = async (districtData) => {
  try {
    const response = await axios.post(API_URL, districtData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create district' };
  }
};

// Get all districts
export const getAllDistricts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch districts' };
  }
};

// Get a specific district by ID
export const getDistrictById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch district' };
  }
};

// Update a district by ID
export const updateDistrict = async (id, districtData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, districtData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update district' };
  }
};

// Delete a district by ID
export const deleteDistrict = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete district' };
  }
};


export const getBirthsAndDeathsByDistrict = async () => {
  try {
    const response = await axios.get(`${API_URL}/births-deaths-by-district`);
    return response.data; // This will return an object containing births and deaths
  } catch (error) {
    console.error("Error fetching births and deaths by district:", error);
    console.error('Error details:', error.response?.data || error.message);
    throw error; // Re-throw the error to handle it in the component
  }
};