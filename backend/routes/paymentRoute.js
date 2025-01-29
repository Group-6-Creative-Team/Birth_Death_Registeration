import express from 'express';
import {
    createPayment,
    getAllPayments,
    getPaymentById,
    deletePayment,
    updatePaymentStatus
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/', createPayment);
router.get('/', getAllPayments);
router.get('/:id', getPaymentById);
router.delete('/:id', deletePayment);
router.put('/status', updatePaymentStatus); 

export default router;
