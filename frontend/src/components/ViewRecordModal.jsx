// export default function ViewRecordModal({ record, setIsViewModalVisible, recordType, placeOfBirth, address }) {
//   if (!record) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white rounded-lg p-6 w-1/2 flex">
//         <div className="w-1/3 mr-6">
//           <img 
//             src={record.image || '/default-image.png'}
//             alt="Record Image"
//             className="w-full h-auto object-cover rounded-lg border"
//           />
//         </div>
//         <div className="flex-1">
//           <h3 className="text-lg font-semibold mb-4">Record Details</h3>
          
//           <div className="space-y-2">
//             <p><strong>ID:</strong> {record.dobId || record.id || 'N/A'}</p>
//             <p><strong>Full Name:</strong> {record.fullName || 'N/A'}</p>
//             {recordType === 'birth' && (
//               <>
//                 <p><strong>Date of Birth:</strong> {record.dob ? new Date(record.dob).toLocaleDateString() : 'N/A'}</p>
//                 <p><strong>Gender:</strong> {record.gender || 'N/A'}</p>
//                 <p><strong>Mother's Name:</strong> {record.motherName || 'N/A'}</p>
//                 <p><strong>Place of Birth:</strong> {placeOfBirth || 'N/A'}</p> {/* Use passed placeOfBirth */}
//                 <p><strong>Occupation:</strong> {record.occupation || 'N/A'}</p>
//                 <p><strong>Address:</strong> {address || 'N/A'}</p> {/* Use passed address */}
//               </>
//             )}
//             {recordType === 'death' && (
//               <>
//                 <p><strong>Date of Death:</strong> {record.dateOfDeath ? new Date(record.dateOfDeath).toLocaleDateString() : 'N/A'}</p>
//                 <p><strong>Cause of Death:</strong> {record.causeOfDeath || 'N/A'}</p>
//                 <p><strong>Place of Death:</strong> {record.placeOfDeath?.discName || 'N/A'}</p>
//               </>
//             )}
//             <p><strong>Payment Status:</strong> {record.paymentStatus === 0 ? 'Pending' : 'Approved'}</p>
//           </div>
//           <div className="flex justify-end mt-4">
//             <button onClick={() => setIsViewModalVisible(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Close</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React from 'react';
import CertificateDetails from './BirthCertificate';

function ViewRecordModal({ record, setIsViewModalVisible }) {
  if (!record) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl overflow-auto">
        <CertificateDetails certificate={record} />
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setIsViewModalVisible(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewRecordModal;

