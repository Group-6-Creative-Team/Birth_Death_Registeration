import PaymentMethod from '../models/paymentMethod.js';

// Create a new payment method
export const createPaymentMethod = async (req, res) => {
    try {
        const { methodName, receiverNumber } = req.body;
        if (!methodName || !receiverNumber) {
            return res.status(400).json({
                message: "All fields are required.",
                missingFields: {
                    methodName: !methodName ? "Missing" : "Present",
                    receiverNumber: !receiverNumber ? "Missing" : "Present",
                }
            });
        }
        const paymentMethod = new PaymentMethod({ methodName, receiverNumber });
        const savedPaymentMethod = await paymentMethod.save();
        res.status(201).json(savedPaymentMethod);
    } catch (error) {
        console.error("Error creating payment method:", error);
        res.status(500).json({ message: error.message });
    }
};


// Get all payment methods
export const getAllPaymentMethods = async (req, res) => {
    try {
        const paymentMethods = await PaymentMethod.find();
        res.status(200).json(paymentMethods);
    } catch (error) {
        console.error("Error fetching payment methods:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get a single payment method by ID
export const getPaymentMethodById = async (req, res) => {
    try {
        const paymentMethod = await PaymentMethod.findById(req.params.id);
        if (!paymentMethod) return res.status(404).json({ message: "Payment method not found" });
        res.status(200).json(paymentMethod);
    } catch (error) {
        console.error("Error fetching payment method:", error);
        res.status(500).json({ message: error.message });
    }
};

// Update a payment method by ID
export const updatePaymentMethod = async (req, res) => {
    try {
        const { methodName, receiverNumber } = req.body;
        const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(
            req.params.id,
            { methodName, receiverNumber },
            { new: true }
        );
        if (!updatedPaymentMethod) return res.status(404).json({ message: "Payment method not found" });
        res.status(200).json(updatedPaymentMethod);
    } catch (error) {
        console.error("Error updating payment method:", error);
        res.status(500).json({ message: error.message });
    }
};

// Delete a payment method by ID
export const deletePaymentMethod = async (req, res) => {
    try {
        const deletedPaymentMethod = await PaymentMethod.findByIdAndDelete(req.params.id);
        if (!deletedPaymentMethod) return res.status(404).json({ message: "Payment method not found" });
        res.status(200).json({ message: "Payment method deleted successfully" });
    } catch (error) {
        console.error("Error deleting payment method:", error);
        res.status(500).json({ message: error.message });
    }
};
