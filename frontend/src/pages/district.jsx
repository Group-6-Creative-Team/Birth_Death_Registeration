import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout';
import { Plus, Trash2, Edit } from 'lucide-react';
import { createDistrict, getAllDistricts, deleteDistrict, updateDistrict } from '../services/districtService';

export default function AddressRegistration() {
  const [districts, setDistricts] = useState([]);
  const [newDistrict, setNewDistrict] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    // Fetch all districts from the backend on component load
    getAllDistricts().then((data) => {
      setDistricts(data);
      setIsLoading(false);
    }).catch((error) => {
      console.error("Error fetching districts:", error);
      setIsLoading(false);
    });
  }, []);

  const handleAddDistrict = async (e) => {
    e.preventDefault();
    if (newDistrict.trim()) {
      try {
        const newDistrictObj = { discName: newDistrict.trim() };
        const createdDistrict = await createDistrict(newDistrictObj); // Create district in backend
        setDistricts([...districts, createdDistrict]); // Update state with new district
        setNewDistrict('');
        setIsFormVisible(false); // Hide the form after adding
      } catch (error) {
        console.error("Error creating district:", error);
      }
    }
  };

  const handleDeleteDistrict = async (id) => {
    try {
      await deleteDistrict(id); // Delete district in backend
      setDistricts(districts.filter((district) => district._id !== id)); // Update state after deletion
    } catch (error) {
      console.error("Error deleting district:", error);
    }
  };

  const handleEditDistrict = async (id, newName) => {
    try {
      const updatedDistrict = await updateDistrict(id, { discName: newName }); // Update district in backend
      setDistricts(districts.map((district) => 
        district._id === id ? updatedDistrict : district
      ));
      setEditingId(null);
    } catch (error) {
      console.error("Error updating district:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Address Registration</h2>
        
        {/* Button to toggle form visibility */}
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isFormVisible ? 'Hide Form' : 'Add District'}
        </button>

        {/* Add District Form, hidden initially */}
        {isFormVisible && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New District</h3>
            <form onSubmit={handleAddDistrict} className="flex gap-4">
              <input
                type="text"
                value={newDistrict}
                onChange={(e) => setNewDistrict(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter district name"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
              >
                Save Address
              </button>
            </form>
          </div>
        )}

        {/* Registered Districts Table */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Registered Districts</h3>
          {isLoading ? (
            <p>Loading districts...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      District Name
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {districts.map((district) => (
                    <tr key={district._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === district._id ? (
                          <input
                            type="text"
                            defaultValue={district.discName}
                            onBlur={(e) => handleEditDistrict(district._id, e.target.value)}
                            className="w-full px-2 py-1 border rounded"
                            autoFocus
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">{district.discName}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setEditingId(district._id)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDistrict(district._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
