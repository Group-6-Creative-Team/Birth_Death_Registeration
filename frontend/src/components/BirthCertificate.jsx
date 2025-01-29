import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Logo from "../assets/Logo.png";

const CertificateDetails = ({ certificate, onClose }) => {
  const certificateRef = useRef();

  const downloadPDF = async () => {
    const doc = new jsPDF();

    // Capture the certificate as an image
    const canvas = await html2canvas(certificateRef.current);
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 190; // Adjust the width as needed
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add image to PDF
    doc.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    
    // Save the PDF
    doc.save("Birth_Certificate.pdf");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div 
        ref={certificateRef} 
        className="max-w-5xl mx-auto bg-cream p-8 shadow-lg rounded-lg border border-gray-300 relative" // Apply light cream background and border
        style={{ backgroundColor: '#FAF3E0' }} // Adjust the background color to light cream
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
        
        {/* Header Section with Logo and Titles */}
        <div className="text-center mb-8 space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
              <img src={Logo} alt="Municipality Logo" className="w-16 h-16 object-contain" />
            </div>
          </div>
          <h1 className="text-xl font-bold uppercase">Dowladda Hoose Ee Muqdisho</h1>
          <h2 className="text-lg">Municipality of Mogadishu</h2>
          <h3 className="text-xl font-semibold mt-4">WARQADDA SUGNAANTA</h3>
          <p className="text-sm text-gray-600">Certificate of Identity Confirmation</p>
        </div>

        {/* Certificate Details */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">MAGACA / Full Name</p>
              <p className="font-semibold">{certificate.fullName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">TAARIIKHDA DHALASHADA / Date of Birth</p>
              <p className="font-semibold">{certificate.dateOfBirth}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">GOORTA DHALASHADA / Place of Birth</p>
              <p className="font-semibold">{certificate.placeOfBirth}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">NUMBERKA KAARKA / ID Number</p>
              <p className="font-semibold">{certificate.idNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">JINSI / Gender</p>
              <p className="font-semibold">{certificate.gender}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">XAALADDA GUURKA / Marital Status</p>
              <p className="font-semibold">{certificate.maritalStatus}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">DEGGAN / Address</p>
              <p className="font-semibold">{certificate.address}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">MAGACA HOOYADA / Mother's Name</p>
              <p className="font-semibold">{certificate.motherName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">TAARIIKHDA LA BIXIYAY / Date of Issue</p>
              <p className="font-semibold">{certificate.dateOfIssue}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">SHAQADA / Occupation</p>
              <p className="font-semibold">{certificate.occupation}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="w-32 h-40 border-2 border-gray-300 rounded-lg overflow-hidden">
            <img src={certificate.photo} alt="ID Photo" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="mt-12 text-center space-y-4">
          <p className="font-semibold">Duqa Magaalada ee Muqdisho</p>
          <p>Mayor of Mogadishu</p>
          <p className="font-semibold">{certificate.mayorName}</p>
        </div>

        {/* Add the Download PDF button */}
        <button
          onClick={downloadPDF}
          className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default CertificateDetails;
