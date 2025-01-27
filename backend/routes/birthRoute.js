import express from 'express';
import {
  createBirthRecord,
  getAllBirthRecords,
  getBirthRecordById,
  updateBirthRecord,
  deleteBirthRecord,
  getApprovedBirthRecords,
  getPendingBirthRecords,
  getBirthRecordDetails,
  getTotalBirthRecords,
  getTotalApprovedBirthRecords,
  fetchTotalMaleBirthRecords,
  fetchTotalFemaleBirthRecords
} from '../controllers/birthController.js';

const router = express.Router();

// Route to create a new date of birth record
router.post('/', createBirthRecord);

// Route to get all date of birth records
router.get('/', getAllBirthRecords);

// Route to get a specific date of birth record by ID


// Route to update a date of birth record by ID


// Route to delete a date of birth record by ID
router.delete('/:id', deleteBirthRecord);

router.get('/approved', getApprovedBirthRecords); // This will handle /api/dob/approved

router.get('/pending', getPendingBirthRecords); 

router.get('/total-dob', getTotalBirthRecords);
router.get('/total-approved-dob', getTotalApprovedBirthRecords);

router.get('/total-male', fetchTotalMaleBirthRecords);
router.get('/total-female', fetchTotalFemaleBirthRecords);

router.put('/:id', updateBirthRecord);
router.get('/:id', getBirthRecordById);
router.get('/birth/:id', getBirthRecordDetails);

export default router;
