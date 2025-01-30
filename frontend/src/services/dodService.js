import axios from 'axios';

const API_URL = 'http://localhost:9000/api/dod'; // Adjust base URL if needed

// Fetch all Dod records
export const fetchAllDodRecords = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all Dod records:", error);
    throw error;
  }
};

// Fetch approved Dod records
export const fetchApprovedDodRecords = async () => {
  try {
    const response = await axios.get(`${API_URL}/approved`);
    return response.data;
  } catch (error) {
    console.error("Error fetching approved Dod records:", error);
    throw error;
  }
};

// Fetch pending Dod records
export const fetchPendingDodRecords = async () => {
  try {
    const response = await axios.get(`${API_URL}/pending`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pending Dod records:", error);
    throw error;
  }
};

// Create a new Dod record
export const createDodRecord = async (data) => {
  try {
    const response = await axios.post(`${API_URL}`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating Dod record:", error);
    throw error;
  }
};

// Update a Dod record
export const updateDodRecord = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating Dod record:", error);
    throw error;
  }
};

// Delete a Dod record
export const deleteDodRecord = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting Dod record:", error);
    throw error;
  }
};

export const getDodRecordById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data; // Return the fetched record data
  } catch (error) {
    console.error("Error fetching death record by ID:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

export const fetchDodRecordDetails = async (dodId) => {
  try {
    const response = await axios.get(`${API_URL}/${dodId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Dod record details:', error);
    throw error; // Rethrow the error for handling in the component
  }
};

export const fetchTotalDodRecords = async () => {
  try {
    const response = await axios.get(`${API_URL}/total-dod`); // Update the API endpoint as necessary
    return response.data.totalDodRecords; // Return the total number of death records
  } catch (error) {
    console.error("Error fetching total death records:", error);
    throw error; // Throw the error to be handled by the caller
  }
};

// Fetch total approved death records
export const fetchTotalApprovedDodRecords = async () => {
  try {
    const response = await axios.get(`${API_URL}/total-approved-dod`); // Update the API endpoint as necessary
    return response.data.totalApprovedDodRecords; // Return the total number of approved death records
  } catch (error) {
    console.error("Error fetching total approved death records:", error);
    throw error; // Throw the error to be handled by the caller
  }
};

 // Replace with your actual API base URL

// Fetch total male death records
export const fetchTotalMaleDeathRecords = async () => {
  try {
    const response = await axios.get(`${API_URL}/total-male`);
    return response.data; // Return the count of male deaths
  } catch (error) {
    console.error("Error fetching total male death records:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Fetch total female death records
export const fetchTotalFemaleDeathRecords = async () => {
  try {
    const response = await axios.get(`${API_URL}/total-female`);
    return response.data; // Return the count of female deaths
  } catch (error) {
    console.error("Error fetching total female death records:", error);
    throw error; // Rethrow the error for further handling
  }
};

