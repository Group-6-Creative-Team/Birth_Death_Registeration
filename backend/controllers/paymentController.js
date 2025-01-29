import Payment from '../models/paymentModel.js';
import Dob from '../models/dobModel.js';
import Dod from '../models/dodModel.js';
import PaymentMethod from '../models/paymentMethod.js';
import mongoose from 'mongoose';
// Create a new payment based on birth or death certificate
// export const createPayment = async (req, res) => {
//     try {
//         console.log('incoming requestbody', req.body)
//         const { certificate_Id, paymentMethod, PaymentType, senderNumber } = req.body;
//         console.log("Incoming request body:", req.body);
//         console.log("Checking certificate existence:", certificate_Id, PaymentType);
//         console.log("Checking payment method existence:", paymentMethod);
        

        
//         // Validate PaymentType and certificate_Id
//         let recordExists;
//         if (PaymentType === 'Birth Certificate') {
//             recordExists = await Dob.findById(certificate_Id);
//         } else if (PaymentType === 'Death Certificate') {
//             recordExists = await Dod.findById(certificate_Id);
//         }
        
//         if (!recordExists) {
//             return res.status(400).json({ message: "Invalid certificate ID for selected payment type" });
//         }

//         // Validate PaymentMethod exists
//         const method = await PaymentMethod.findById(paymentMethod);
//         if (!method) {
//             return res.status(400).json({ message: "Invalid PaymentMethod ID" });
//         }

//         const payment = new Payment({
//             certificate_Id,
//             paymentMethod: method._id,
//             PaymentType,
//             senderNumber
//         });

//         const savedPayment = await payment.save();
//         res.status(201).json(savedPayment);
//     } catch (error) {
//         console.error("Error creating payment:", error);
//         res.status(500).json({ message: error.message });
//     }
// };
export const createPayment = async (req, res) => {
    try {
        const { certificate_Id, paymentMethod, PaymentType, senderNumber } = req.body; // updated field to `paymentMethod`

        console.log("Incoming request body:", req.body);
        console.log("Checking certificate existence:", certificate_Id, PaymentType);
        console.log("Checking payment method existence:", paymentMethod);

        if (!certificate_Id || !paymentMethod || !PaymentType || !senderNumber) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Validate PaymentType and certificate_Id
        let recordExists;
        if (PaymentType === 'Birth Certificate') {
            recordExists = await Dob.findById(certificate_Id);
        } else if (PaymentType === 'Death Certificate') {
            recordExists = await Dod.findById(certificate_Id);
        }

        if (!recordExists) {
            return res.status(400).json({ message: "Invalid certificate ID for selected payment type" });
        }

        // Validate PaymentMethod exists
        const paymentMethodRecord = await PaymentMethod.findById(paymentMethod);
        if (!paymentMethodRecord) {
            return res.status(400).json({ message: "Invalid PaymentMethod ID" });
        }

        const payment = new Payment({
            certificate_Id,
            PaymentMethod: paymentMethodRecord._id,
            PaymentType,
            senderNumber
        });

        const savedPayment = await payment.save();
        res.status(201).json(savedPayment);
    } catch (error) {
        console.error("Error creating payment:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get all payments
export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('PaymentMethod', 'methodName receiverNumber amount');
        res.status(200).json(payments);
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get a single payment by ID
export const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('PaymentMethod', 'methodName receiverNumber amount');
        if (!payment) return res.status(404).json({ message: "Payment not found" });
        res.status(200).json(payment);
    } catch (error) {
        console.error("Error fetching payment:", error);
        res.status(500).json({ message: error.message });
    }
};

// Delete a payment by ID
export const deletePayment = async (req, res) => {
    try {
        const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
        if (!deletedPayment) return res.status(404).json({ message: "Payment not found" });
        res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
        console.error("Error deleting payment:", error);
        res.status(500).json({ message: error.message });
    }
};

// Update payment status by ID
// Update payment status in Dob or Dod based on paymentType


// export const updatePaymentStatus = async (req, res) => {
//     try {
//         const { certificate_Id, PaymentType } = req.body;

//         let updatedRecord;
//         const objectId =  mongoose.Types.ObjectId(certificate_Id); // Correctly use as a function

//         if (PaymentType === 'Birth Certificate') {
//             updatedRecord = await Dob.findByIdAndUpdate(objectId, { paymentStatus: 1 }, { new: true });
//         } else if (PaymentType === 'Death Certificate') {
//             updatedRecord = await Dod.findByIdAndUpdate(objectId, { paymentStatus: 1 }, { new: true });
//         }

//         if (!updatedRecord) {
//             return res.status(404).json({ message: "Record not found" });
//         }

//         res.status(200).json({ message: "Payment status updated successfully", updatedRecord });
//     } catch (error) {
//         console.error("Error updating payment status:", error);
//         res.status(500).json({ message: error.message });
//     }
// };
export const updatePaymentStatus = async (req, res) => {
    try {
        const { certificate_Id, PaymentType } = req.body;

        let updatedRecord;

        if (PaymentType === 'Birth Certificate') {
            // Find and update Dob record
            const birthRecord = await Dob.findById(certificate_Id);
            if (!birthRecord) {
                return res.status(404).json({ message: "Birth certificate record not found." });
            }
            updatedRecord = await Dob.findByIdAndUpdate(certificate_Id, { paymentStatus: 1 }, { new: true }).populate('placeOfBirth', 'discName');
        } else if (PaymentType === 'Death Certificate') {
            // Find and update Dod record
            const deathRecord = await Dod.findById(certificate_Id);
            if (!deathRecord) {
                return res.status(404).json({ message: "Death certificate record not found." });
            }
            updatedRecord = await Dod.findByIdAndUpdate(certificate_Id, { paymentStatus: 1 }, { new: true }).populate('dob', 'fullName').populate('placeOfDeath', 'discName');
        }

        res.status(200).json({ message: "Payment status updated successfully", updatedRecord });
    } catch (error) {
        console.error("Error updating payment status:", error);
        res.status(500).json({ message: error.message });
    }
};