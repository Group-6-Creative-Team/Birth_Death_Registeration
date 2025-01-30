import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout';
import { fetchApprovedDobRecords, fetchBirthRecordDetails } from '../services/dobService';
import { getAllDistricts } from '../services/districtService';
import CertificateDetails from '../components/BirthCertificate.jsx'; // Certificate component for viewing details

export default function ApprovedBirthCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [districtMap, setDistrictMap] = useState({});
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Fetch districts and create a mapping
  useEffect(() => {
    const fetchDistrictsAndCertificates = async () => {
      try {
        // Fetch districts
        const districts = await getAllDistricts();
        const mapping = districts.reduce((acc, district) => {
          acc[district._id] = district.discName;
          return acc;
        }, {});
        setDistrictMap(mapping);

        // Fetch approved birth records
        const approvedRecords = await fetchApprovedDobRecords();
        const mappedCertificates = approvedRecords.map((certificate) => ({
          ...certificate,
          address: mapping[certificate.address] || 'N/A', // Replace with district name
          placeOfBirth: mapping[certificate.placeOfBirth] || 'N/A', // Replace with district name
        }));
        setCertificates(mappedCertificates);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };

    fetchDistrictsAndCertificates();
  }, []);

  // Show certificate modal with selected record details
  const handleViewRecordClick = async (record) => {
    try {
      const dobDetails = await fetchBirthRecordDetails(record._id);
      setSelectedRecord({
        fullName: dobDetails.fullName || 'N/A',
        dateOfBirth: dobDetails.dob || 'N/A',
        placeOfBirth: districtMap[dobDetails.placeOfBirth] || 'N/A', // Get name from districtMap
        idNumber: dobDetails.dobId || 'N/A',
        gender: dobDetails.gender || 'N/A',
        maritalStatus: dobDetails.materialState || 'N/A',
        address: districtMap[dobDetails.address] || 'N/A', // Get name from districtMap
        motherName: dobDetails.motherName || 'N/A',
        dateOfIssue: dobDetails.dateOfIssue || 'N/A',
        occupation: dobDetails.occupation || 'N/A',
        photo: dobDetails.image || '/placeholder.svg',
        mayorName: 'Cumar Maxamuud Maxamed',
      });
      setShowCertificateModal(true);
    } catch (error) {
      console.error("Error fetching birth record details:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Approved Birth Certificates</h2>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {isLoading ? (
            <p>Loading certificates...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Image</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Full Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Date of Birth</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Gender</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Place of Birth</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Address</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Payment Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((certificate) => (
                    <tr key={certificate._id} className="border-b last:border-b-0">
                      <td className="py-3 px-4">{certificate.dobId}</td>
                      <td className="py-3 px-4">
                        <img src={certificate.image || "/placeholder.svg"} alt="" className="w-10 h-10 rounded-full object-cover" />
                      </td>
                      <td className="py-3 px-4">{certificate.fullName}</td>
                      <td className="py-3 px-4">{new Date(certificate.dob).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{certificate.gender}</td>
                      <td className="py-3 px-4">{certificate.placeOfBirth}</td>
                      <td className="py-3 px-4">{certificate.address}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {certificate.paymentStatus === 1 ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleViewRecordClick(certificate)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          View Certificate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showCertificateModal && selectedRecord && (
          <CertificateDetails
            certificate={selectedRecord}
            onClose={() => setShowCertificateModal(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
