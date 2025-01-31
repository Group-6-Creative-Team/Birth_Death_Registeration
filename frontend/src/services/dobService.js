// dobService.js
import axios from 'axios';

const DOB_API_URL = 'http://localhost:9000/api/birth';

// Create a new DOB record
// export const createDobRecord = async (dobData) => {
//   try {
//     const response = await axios.post(DOB_API_URL, dobData, {
//       headers: { 'Content-Type': 'application/json' },
//     });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'Failed to create DOB record' };
//   }
// };
export const createDobRecord = async (data) => {
  try {
      console.log("Creating DOB Record with data:", data); // Log data before sending
      const response = await axios.post(DOB_API_URL, data); // Ensure this endpoint is correct
      console.log("Response from create:", response); // Log response
      return response.data; // Return the actual data
  } catch (error) {
      console.error("Error in createDobRecord service:", error); // Log the error
      throw error; // Re-throw the error so that it can be handled upstream
  }
};

// Get all DOB records
export const getAllDobRecords = async () => {
  try {
    const response = await axios.get(DOB_API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch DOB records' };
  }
};

// Get a single DOB record by ID
export const getDobRecordById = async (id) => {
  try {
    const response = await axios.get(`${DOB_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch DOB record' };
  }
};

// Update a DOB record by ID
export const updateDobRecord = async (id, dobData) => {
  try {
    const response = await axios.put(`${DOB_API_URL}/${id}`, dobData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update DOB record' };
  }
};

// Delete a DOB record by ID
export const deleteDobRecord = async (id) => {
  try {
    const response = await axios.delete(`${DOB_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete DOB record' };
  }
};

export const fetchApprovedDobRecords = async () => {
  try {
    const response = await axios.get(`${DOB_API_URL}/approved`);
    return response.data;
  } catch (error) {
    console.error('Error fetching approved records:', error);
    throw error;
  }
};

export const fetchPendingDobRecords = async () => {
  try {
    const response = await axios.get(`${DOB_API_URL}/pending`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pending records:', error);
    throw error;
  }
};

export const fetchBirthRecordDetails = async (id) => {
  try {
    const response = await axios.get(`${DOB_API_URL}/${id}`); // Adjust the endpoint as needed
    return response.data; // Return the data from the response
  } catch (error) {
    console.error('Error fetching birth record details:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};


export const fetchTotalDobRecords = async () => {
  try {
    const response = await axios.get(`${DOB_API_URL}/total-dob`); // Update the API endpoint as necessary
    return response.data.totalDobRecords; // Return the total number of birth records
  } catch (error) {
    console.error("Error fetching total birth records:", error);
    throw error; // Throw the error to be handled by the caller
  }
};

// Fetch total approved birth records
export const fetchTotalApprovedDobRecords = async () => {
  try {
    const response = await axios.get(`${DOB_API_URL}/total-approved-dob`); // Update the API endpoint as necessary
    return response.data.totalApprovedDobRecords; // Return the total number of approved birth records
  } catch (error) {
    console.error("Error fetching total approved birth records:", error);
    throw error; // Throw the error to be handled by the caller
  }
};
// Fetch total male birth records
export const fetchTotalMaleBirthRecords = async () => {
  try {
    const response = await axios.get(`${DOB_API_URL}/total-male`);
    return response.data; // Return the count of male births
  } catch (error) {
    console.error("Error fetching total male birth records:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Fetch total female birth records
export const fetchTotalFemaleBirthRecords = async () => {
  try {
    const response = await axios.get(`${DOB_API_URL}/total-female`);
    return response.data; // Return the count of female births
  } catch (error) {
    console.error("Error fetching total female birth records:", error);
    throw error; // Rethrow the error for further handling
  }
};
