import express from 'express';
import {
  createDistrict,
  getAllDistricts,
  getDistrictById,
  updateDistrict,
  deleteDistrict,
  getBirthsAndDeathsByDistrict
} from '../controllers/districtControllers.js';

const router = express.Router();

router.post('/', createDistrict); // Create new district
router.get('/', getAllDistricts);
router.get('/births-deaths-by-district', getBirthsAndDeathsByDistrict);
router.get('/:id', getDistrictById); // Get a specific district by ID
router.put('/:id', updateDistrict); // Update a district by ID
router.delete('/:id', deleteDistrict); // Delete a district by ID

export default router;
