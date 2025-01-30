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
    const imgWidth = 190; // You may adjust the width
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add image to PDF
    doc.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    
    // Save the PDF
    doc.save("Certificate.pdf");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div ref={certificateRef} className="max-w-5xl mx-auto bg-white p-8 shadow-lg rounded-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>

        {/* Existing certificate content goes here... */}
        <div className="text-center mb-8 space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
              <img src={Logo} alt="Municipality Logo" className="w-16 h-16 object-contain" />
            </div>
          </div>
          <h1 className="text-xl font-bold uppercase">Dowladda Hoose Ee Muqdisho</h1>
          <h2 className="text-lg">Municipality of Mogadishu</h2>
          <h3 className="text-xl font-semibold mt-4">SHAHADADA DHIMASHADA</h3>
          <p className="text-sm text-gray-600">Death Certificate</p>
        </div>

        {/* Certificate Details */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">MAGACA / Full Name</p>
              <p className="font-semibold">{certificate?.fullName || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">TAARIIKHDA DHALASHADA / Date of Birth</p>
              <p className="font-semibold">{certificate?.dateOfBirth || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">GOORTA DHIMASHADA / Place of Death</p>
              <p className="font-semibold">{certificate?.placeOfDeath || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">NUMBERKA KAARKA / ID Number</p>
              <p className="font-semibold">{certificate?.idNumber || 'N/A'}</p>
            </div>
            
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">JINSI / Gender</p>
              <p className="font-semibold">{certificate?.gender || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">GOOBTA DHIMASHADA / Cause of Death</p>
              <p className="font-semibold">{certificate?.causeOfDeath || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">MAGACA HOOYADA / Mother's Name</p>
              <p className="font-semibold">{certificate?.motherName || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">TAARIIKHDA LA BIXIYAY / Date of Death</p>
              <p className="font-semibold">{certificate?.dateOfIssue || 'N/A'}</p>
            </div>
            
          </div>
        </div>

        {/* ID Photo Section */}
        <div className="mt-8 flex justify-end">
          <div className="w-32 h-40 border-2 border-gray-300 rounded-lg overflow-hidden">
            <img src={certificate?.photo || '/default-image.png'} alt="ID Photo" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Signature Section */}
        <div className="mt-12 text-center space-y-4">
          <p className="font-semibold">Duqa Magaalada ee Muqdisho</p>
          <p>Mayor of Mogadishu</p>
          <p className="font-semibold">{certificate?.mayorName || 'N/A'}</p>
          
        </div>

        {/* Add the Download PDF button */}
        <button
          onClick={downloadPDF}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default CertificateDetails;
