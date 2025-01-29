import express from 'express';
import {
    createPaymentMethod,
    getAllPaymentMethods,
    getPaymentMethodById,
    updatePaymentMethod,
    deletePaymentMethod
} from '../controllers/paymentMethodController.js';

const router = express.Router();

router.post('/', createPaymentMethod);
router.get('/', getAllPaymentMethods);
router.get('/:id', getPaymentMethodById);
router.put('/:id', updatePaymentMethod);
router.delete('/:id', deletePaymentMethod);

export default router;
