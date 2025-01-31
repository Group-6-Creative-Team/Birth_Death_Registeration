import { useState, useEffect } from 'react';
import { getPaymentMethods, createPayment, updatePaymentStatus } from '../services/paymentService';

function PaymentModal({ selectedRecord, setIsPaymentModalVisible, setRecords, isDeathRecord }) {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [formData, setFormData] = useState({
    recordId: selectedRecord.certificate_Id || selectedRecord.dobId || selectedRecord._id,
    fullName: selectedRecord.fullName,
    paymentMethodId: '',
    receiverNumber: '',
    paymentType: selectedRecord.paymentType || (isDeathRecord ? 'Death Certificate' : 'Birth Certificate'),
    amount: '',
    senderNumber: ''
  });

  useEffect(() => {
    getPaymentMethods().then((data) => setPaymentMethods(data));
  }, []);

  const handlePaymentMethodChange = (e) => {
    const selectedMethod = paymentMethods.find((method) => method._id === e.target.value);
    setFormData({
      ...formData,
      paymentMethodId: selectedMethod._id,
      receiverNumber: selectedMethod.receiverNumber,
      amount: selectedMethod.amount
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'senderNumber') {
      // Ensure the number starts with +252- and restricts to exactly 9 more digits
      if (!value.startsWith('+252-')) {
        setFormData((prev) => ({ ...prev, [name]: '+252-' }));
      } else if (/^\+252-\d{0,9}$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleApprovePayment = async () => {
    try {
      // First, create the payment record
      const payload = {
        certificate_Id: formData.recordId,
        paymentMethod: formData.paymentMethodId,
        PaymentType: formData.paymentType,
        senderNumber: formData.senderNumber
      };
      await createPayment(payload);

      // Update the payment status
      const statusPayload = { certificate_Id: formData.recordId, PaymentType: formData.paymentType };
      await updatePaymentStatus(statusPayload);

      // Update the main records state in BirthRegistration immediately
      setRecords((prevRecords) =>
        prevRecords.map((record) =>
          record._id === selectedRecord._id ? { ...record, paymentStatus: 1 } : record
        )
      );

      setIsPaymentModalVisible(false); // Close modal
    } catch (error) {
      console.error("Error approving payment:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-1/3">
        <h3 className="text-lg font-semibold mb-4">Approve Payment</h3>
        <form className="space-y-4">
          <input 
            type="text" 
            value={formData.fullName} 
            disabled 
            className="w-full px-4 py-2 border rounded-lg bg-gray-100" 
          />
          <select 
            name="paymentMethodId" 
            value={formData.paymentMethodId} 
            onChange={handlePaymentMethodChange} 
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select Payment Method</option>
            {paymentMethods.map((method) => (
              <option key={method._id} value={method._id}>{method.methodName}</option>
            ))}
          </select>
          <input 
            type="text" 
            name="receiverNumber" 
            value={formData.receiverNumber} 
            disabled 
            placeholder="Receiver Number" 
            className="w-full px-4 py-2 border rounded-lg bg-gray-100" 
          />
          <input 
            type="text" 
            name="paymentType" 
            value={formData.paymentType} 
            disabled 
            className="w-full px-4 py-2 border rounded-lg bg-gray-100" 
          />
          <input 
            type="text" 
            name="amount" 
            value={formData.amount} 
            disabled 
            className="w-full px-4 py-2 border rounded-lg bg-gray-100" 
          />
          <input 
            type="text" 
            name="senderNumber" 
            value={formData.senderNumber} 
            onChange={handleInputChange} 
            placeholder="Sender Number" 
            className="w-full px-4 py-2 border rounded-lg" 
          />
          <div className="flex justify-end mt-4">
            <button 
              onClick={() => setIsPaymentModalVisible(false)} 
              className="px-4 py-2 bg-gray-300 rounded-lg mr-2"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handleApprovePayment} 
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Approve Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentModal;
