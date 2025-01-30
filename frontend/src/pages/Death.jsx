import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import PaymentModal from '../components/PaymentModel';
import toast, { Toaster } from 'react-hot-toast';
import { fetchPendingDodRecords, deleteDodRecord, createDodRecord, updateDodRecord ,getDodRecordById , fetchDodRecordDetails} from '../services/dodService';
import { getAllDistricts } from '../services/districtService';
import { getAllDobRecords } from '../services/dobService';
import Select from 'react-select';
// import DeathCertificateGenerator from '../components/DeathCertificate.jsx';

export default function DeathRegistration() {
  const [showForm, setShowForm] = useState(false);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [districts, setDistricts] = useState([]);
  const [dobRecords, setDobRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    dob: '',
    dateOfDeath: '',
    causeOfDeath: '',
    placeOfDeath: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  // const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  // const [viewRecord, setViewRecord] = useState(null);
  const [districtMap, setDistrictMap] = useState({});
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  // const [isDeathCertificateVisible, setIsDeathCertificateVisible] = useState(false);


  useEffect(() => {
    fetchPendingDodRecords()
      .then((data) => setRecords(data))
      .catch((error) => console.error("Error fetching records:", error))
      .finally(() => setIsLoading(false));

      getAllDistricts()
      .then((data) => {
        setDistricts(data);
        const mapping = data.reduce((acc, district) => {
          acc[district._id] = district.discName; // Map each district ID to its name
          return acc;
        }, {});
        setDistrictMap(mapping); // Set the districtMap
      })
      .catch((error) => console.error("Error fetching districts:", error));
      getAllDobRecords()
      .then((data) => setDobRecords(data))
      .catch((error) => console.error("Error fetching dob records:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewRecord((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const { dob, dateOfDeath, causeOfDeath, placeOfDeath, image } = newRecord;

  //   if (!dob || !dateOfDeath || !causeOfDeath || !placeOfDeath) {
  //     toast.error("Please fill in all fields.");
  //     return;
  //   }

  //   try {
  //     let base64Image = imagePreview; // Use existing image if no new upload
  //     if (image) {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(image);
  //       base64Image = await new Promise((resolve) => {
  //         reader.onload = () => resolve(reader.result);
  //       });
  //     }

  //     const payload = { dob, dateOfDeath, causeOfDeath, placeOfDeath, image: base64Image };
  //     let updatedRecords;

  //     if (editingId) {
  //       await updateDodRecord(editingId, payload);
  //       updatedRecords = records.map((record) => (record._id === editingId ? { ...record, ...payload } : record));
  //       setEditingId(null);
  //     } else {
  //       const createdRecord = await createDodRecord(payload);
  //       updatedRecords = [...records, createdRecord];
  //     }

  //     setRecords(updatedRecords);
  //     setNewRecord({ dob: '', dateOfDeath: '', causeOfDeath: '', placeOfDeath: '', image: null });
  //     setImagePreview('');
  //     setShowForm(false);
  //     toast.success(editingId ? "Record updated successfully!" : "Record added successfully!");
  //   } catch (error) {
  //     console.error("Error creating or updating record:", error);
  //     toast.error("Failed to save record.");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { dob, dateOfDeath, causeOfDeath, placeOfDeath } = newRecord;
  
    // Check if essential fields are filled
    if (!dob || !dateOfDeath || !causeOfDeath || !placeOfDeath) {
      toast.error("Please fill in all fields.");
      return;
    }
  
    try {
      let base64Image = null; // Initialize with null
  
      // Check if a new image was uploaded
      if (newRecord.image) {
        const reader = new FileReader();
        reader.readAsDataURL(newRecord.image);
        base64Image = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject; // Handle the error if reading fails
        });
      } else {
        // If no new image is provided, use the existing image
        const existingRecord = records.find(record => record._id === editingId);
        base64Image = existingRecord?.image; // Use the existing image if available
      }
  
      // Prepare payload for submission
      const payload = { dob, dateOfDeath, causeOfDeath, placeOfDeath, image: base64Image };
      let updatedRecords;
  
      if (editingId) {
        await updateDodRecord(editingId, payload);
        updatedRecords = records.map((record) => (record._id === editingId ? { ...record, ...payload } : record));
        setEditingId(null);
        
      } else {
        const createdRecord = await createDodRecord(payload);
        updatedRecords = [...records, createdRecord];
      }
  
      // Update state after submission
      setRecords(updatedRecords);
      setNewRecord({ dob: '', dateOfDeath: '', causeOfDeath: '', placeOfDeath: '', image: null });
      setImagePreview('');
      setShowForm(false);
      toast.success(editingId ? "Record updated successfully!" : "Record added successfully!");
    } catch (error) {
      console.error("Error creating or updating record:", error);
      toast.error("Failed to save record.");
    }
  };
  const handlePendingPaymentClick = (record) => {
    setSelectedRecord({
      ...record,
      certificate_Id: record._id,
      fullName: record.dob?.fullName || '',
      paymentType: 'Death Certificate'
    });
    setIsPaymentModalVisible(true);
  };
  // const formatDate = (dateString) => {
  //   if (!dateString) return 'N/A';
  //   const date = new Date(dateString);
  //   const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  //   return date.toLocaleDateString('en-US', options);
  // };
  // const handleViewRecordClick = async (record) => {
  //   try {
  //     const dodDetails = await fetchDodRecordDetails(record._id);
  //     console.log('Dod Details:', dodDetails);  
  //     setSelectedRecord({ 
  //       fullName: dodDetails.fullName || 'N/A',
  //       dateOfBirth: formatDate(dodDetails.dateOfBirth) || 'N/A',
  //       placeOfBirth: dodDetails.placeOfDeath || 'N/A', 
  //       idNumber: dodDetails.dobSequenceID || 'N/A',    
  //       gender: dodDetails.gender || 'N/A',
  //       address: dodDetails.address || 'N/A',
  //       motherName: dodDetails.motherName || 'N/A',
  //       dateOfIssue: formatDate(dodDetails.dateOfDeath) || 'N/A', 
  //       photo: dodDetails.image || '/placeholder.svg',
  //       mayorName: 'Cumar Maxamuud Maxamed', 
  //       causeOfDeath: dodDetails.causeOfDeath || 'N/A', 
  //       placeOfDeath: dodDetails.placeOfDeath || 'N/A', 
  //     });
      
  
  //     setShowCertificateModal(true); // Open the certificate modal
  //   } catch (error) {
  //     console.error("Error fetching death record:", error);
  //   }
  // };
  const handleEditRecord = (record) => {
    setNewRecord({
      dob: record.dob._id,
      dateOfDeath: record.dateOfDeath.split("T")[0],
      causeOfDeath: record.causeOfDeath,
      placeOfDeath: record.placeOfDeath._id,
      image: record.image,
    });
    setImagePreview(record.image);
    setEditingId(record._id);
    setShowForm(true);
  };

  const handleDeleteRecord = async (id) => {
    try {
      await deleteDodRecord(id);
      setRecords(records.filter((record) => record._id !== id));
      toast.success("Record deleted successfully!");
    } catch (error) {
      toast.error("Error deleting record. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Death Registration</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {showForm ? "Hide Form" : "Add Record"}
          </button>
        </div>

        {showForm && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">{editingId ? "Edit Death Record" : "Add New Death Record"}</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <select
                  name="dob"
                  value={newRecord.dob}
                  onChange={handleInputChange}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Full Name (based on birth record)</option>
                  {dobRecords.map((dobRecord) => (
                    <option key={dobRecord._id} value={dobRecord._id}>
                      {dobRecord.fullName}
                    </option>
                  ))}
                </select> */}
                <Select
                  name="dob"
                  value={dobRecords.find(dobRecord => dobRecord._id === newRecord.dob) || null}
                  onChange={(selectedOption) => setNewRecord((prev) => ({ ...prev, dob: selectedOption.value }))}
                  options={dobRecords.map(dobRecord => ({ value: dobRecord._id, label: dobRecord.fullName }))}
                  placeholder="Select Full Name (based on birth record)"
                  isClearable
                  isSearchable
                  className="basic-single"
                  classNamePrefix="select"
                />

                <input
                  type="date"
                  name="dateOfDeath"
                  value={newRecord.dateOfDeath}
                  onChange={handleInputChange}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="causeOfDeath"
                  value={newRecord.causeOfDeath}
                  onChange={handleInputChange}
                  placeholder="Cause of Death"
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key >= '0' && e.key <= '9') {
                      e.preventDefault();
                      toast.error("only Text is allowed")
                    }
                    
                  }}
                />
                <select
                  name="placeOfDeath"
                  value={newRecord.placeOfDeath}
                  onChange={handleInputChange}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Place of Death</option>
                  {districts.map((district) => (
                    <option key={district._id} value={district._id}>
                      {district.discName}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="md:col-span-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingId ? "Update Record" : "Save Record"}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
              <label className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                Upload Image
                <input type="file" onChange={handleImageChange} className="hidden" />
              </label>
              {imagePreview && (
                <img src={imagePreview} alt="Selected" className="w-full h-auto rounded-lg border mt-4" />
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Pending Death Records</h3>
          {isLoading ? (
            <p>Loading death records...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2">Full Name</th>
                  <th className="px-4 py-2">Date of Death</th>
                  <th className="px-4 py-2">Cause of Death</th>
                  <th className="px-4 py-2">Place of Death</th>
                  <th className="px-4 py-2">Payment Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record) => (
                  <tr key={record._id}>
                    <td className="px-4 py-2">{record.id}</td>
                    <td className="px-4 py-2">
                      <img
                        src={record.image || '/default-image.png'}
                        alt="Record Image"
                        className="w-10 h-10 object-cover rounded-md"
                      />
                    </td>
                    <td className="px-4 py-2">{record.dob?.fullName}</td>
                    <td className="px-4 py-2">{new Date(record.dateOfDeath).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{record.causeOfDeath}</td>
                    <td className="px-4 py-2">{record.placeOfDeath?.discName}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          record.paymentStatus === 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {record.paymentStatus === 0 ? 'Pending' : 'Approved'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePendingPaymentClick(record)}
                          className="px-3 py-1 bg-green-500 text-white rounded-full"
                        >
                          Pay
                        </button>
                        {/* <button
                          onClick={() => handleViewRecordClick(record)}
                          className="p-1 text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button> */}
                        <button
                          onClick={() => handleEditRecord(record)}
                          className="p-1 text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(record._id)}
                          className="p-1 text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {isPaymentModalVisible && (
          <PaymentModal
            selectedRecord={selectedRecord}
            setIsPaymentModalVisible={setIsPaymentModalVisible}
            setRecords={setRecords}
            isDeathRecord={true}
          />
        )}

        {/* {showCertificateModal && selectedRecord && (
            <DeathCertificateGenerator
                certificate={selectedRecord}
                onClose={() => setShowCertificateModal(false)}
            />
        )} */}

      </div>
    </DashboardLayout>
  );
}
