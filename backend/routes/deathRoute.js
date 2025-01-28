import express from 'express';
import {
  createDeathRecord,
  getAllDeathRecords,
  updateDeathRecord,
  deleteDeathRecord,
  getApprovedDeathRecords,
  getPendingDeathRecords,
  fetchDeathRecordDetails,
  getTotalDeathRecords,
  getTotalApprovedDeathRecords ,
  fetchTotalMaleDeathRecords,
  fetchTotalFemaleDeathRecords
} from '../controllers/deathController.js';
const router = express.Router();

router.post('/', createDeathRecord); // Create new record
router.get('/', getAllDeathRecords);
router.get('/approved', getApprovedDeathRecords);  // Route for approved records
router.get('/pending', getPendingDeathRecords);
router.get('/total-dod', getTotalDeathRecords);
router.get('/total-approved-dod', getTotalApprovedDeathRecords); // Get all records
// router.get('/:id', getDodRecordById); // Get a single record by ID
router.get('/total-male', fetchTotalMaleDeathRecords);
router.get('/total-female', fetchTotalFemaleDeathRecords);

router.put('/:id', updateDeathRecord); // Update a record by ID
router.delete('/:id', deleteDeathRecord);
router.get('/:dod_id', fetchDeathRecordDetails) 

export default router;
