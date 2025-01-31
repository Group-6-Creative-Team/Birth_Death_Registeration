import Death from '../models/death.js';
import District from '../models/districtsModel.js';
import Birth from '../models/birth.js';
import mongoose from 'mongoose';

// Create a new Death record
export const createDeathRecord = async (req, res) => {
  try {
    console.log("Incoming Data:", req.body);
    const { birth, image, dateOfDeath, causeOfDeath, placeOfDeath } = req.body;

    if (!mongoose.Types.ObjectId.isValid(birth)) {
      return res.status(400).json({ message: "Invalid birth certificate ID format." });
    }

    const birthRecord = await Birth.findById(birth);
    if (!birthRecord) {
      return res.status(400).json({ message: "Person does not exist. Provide a valid birth certificate ID." });
    }

    if (!mongoose.Types.ObjectId.isValid(placeOfDeath)) {
      return res.status(400).json({ message: "Invalid district ID for placeOfDeath." });
    }

    const placeOfDeathDistrict = await District.findById(placeOfDeath);
    if (!placeOfDeathDistrict) {
      return res.status(400).json({ message: "District ID for placeOfDeath is not found." });
    }

    // Generate auto-incremented ID
    const lastRecord = await Death.findOne().sort({ id: -1 });
    const newId = lastRecord && typeof lastRecord.id === 'number' ? lastRecord.id + 1 : 101;

    const newDeath = new Death({
      id: newId,
      birth: birthRecord._id,
      image,
      dateOfDeath,
      causeOfDeath,
      placeOfDeath: placeOfDeathDistrict._id,
      paymentStatus: 0
    });

    const savedDeath = await newDeath.save();

    const populatedDeath = await Death.findById(savedDeath._id)
      .populate('birth', 'fullName')
      .populate('placeOfDeath', 'discName');

    res.status(201).json(populatedDeath);
  } catch (error) {
    console.error("Error in createDeathRecord:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all Death records
// export const getAllDeathRecords = async (req, res) => {
//   try {
//     const deathRecords = await Death.find()
//       .populate('placeOfDeath', 'discName')
//       .populate('birth', 'fullName');
//     res.status(200).json(deathRecords);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Get a single Death record by ID
// export const getDeathRecordById = async (req, res) => {
//   try {
//     const deathRecord = await Death.findById(req.params.id)
//       .populate('birth', 'fullName')
//       .populate('placeOfDeath', 'discName');

//     if (!deathRecord) return res.status(404).json({ message: "Record not found" });

//     res.status(200).json(deathRecord);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Fetch details for a specific Death record
// export const fetchDeathRecordDetails = async (req, res) => {
//   const { dod_id } = req.params;
//   console.log('Fetching Death Record ID:', dod_id);

//   if (!mongoose.Types.ObjectId.isValid(dod_id)) {
//     return res.status(400).json({ message: 'Invalid Death ID format' });
//   }

//   try {
//     const deathRecord = await Death.findById(dod_id)
//       .select('id image dateOfDeath causeOfDeath placeOfDeath')
//       .populate({
//         path: 'birth',
//         model: Birth,
//         select: 'fullName dobId motherName gender occupation dob address',
//         populate: {
//           path: 'address',
//           model: District,
//           select: 'discName',
//         },
//       })
//       .populate({
//         path: 'placeOfDeath',
//         model: District,
//         select: 'discName',
//       });

//     if (!deathRecord) {
//       return res.status(404).json({ message: 'Record not found' });
//     }

//     const responseData = {
//       deathSequenceID: deathRecord.id,
//       image: deathRecord.image,
//       dateOfDeath: deathRecord.dateOfDeath,
//       causeOfDeath: deathRecord.causeOfDeath,
//       placeOfDeath: deathRecord.placeOfDeath ? deathRecord.placeOfDeath.discName : null,
//       fullName: deathRecord.birth ? deathRecord.birth.fullName : null,
//       dobSequenceID: deathRecord.birth ? deathRecord.birth.dobId : null,
//       motherName: deathRecord.birth ? deathRecord.birth.motherName : null,
//       gender: deathRecord.birth ? deathRecord.birth.gender : null,
//       dateOfBirth: deathRecord.birth ? deathRecord.birth.dob : null,
//       address: deathRecord.birth ? deathRecord.birth.address : null,
//       occupation: deathRecord.birth ? deathRecord.birth.occupation : null,
//     };

//     res.status(200).json(responseData);
//   } catch (error) {
//     console.error("Error fetching Death record:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// Get all approved Death records
// export const getApprovedDeathRecords = async (req, res) => {
//   try {
//     const approvedDeathRecords = await Death.find({ paymentStatus: 1 })
//       .populate('birth', 'fullName')
//       .populate('placeOfDeath', 'discName');

//     res.status(200).json(approvedDeathRecords);
//   } catch (error) {
//     console.error("Error in getApprovedDeathRecords:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// Get all pending Death records
// export const getPendingDeathRecords = async (req, res) => {
//   try {
//     const pendingDeathRecords = await Death.find({ paymentStatus: 0 })
//       .populate('birth', 'fullName')
//       .populate('placeOfDeath', 'discName');

//     res.status(200).json(pendingDeathRecords);
//   } catch (error) {
//     console.error("Error in getPendingDeathRecords:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// Get total Death records
export const getTotalDeathRecords = async (req, res) => {
  try {
    const totalDeathRecords = await Death.countDocuments();
    res.status(200).json({ totalDeathRecords });
  } catch (error) {
    console.error("Error in getTotalDeathRecords:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get total approved Death records
export const getTotalApprovedDeathRecords = async (req, res) => {
  try {
    const totalApprovedDeathRecords = await Death.countDocuments({ paymentStatus: 1 });
    res.status(200).json({ totalApprovedDeathRecords });
  } catch (error) {
    console.error("Error in getTotalApprovedDeathRecords:", error);
    res.status(500).json({ message: error.message });
  }
};

// Fetch total Male and Female Death Records
export const fetchTotalMaleDeathRecords = async (req, res) => {
  try {
    const count = await Death.countDocuments({ gender: 'Male' });
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error in fetchTotalMaleDeathRecords:", error);
    res.status(500).json({ message: error.message });
  }
};

export const fetchTotalFemaleDeathRecords = async (req, res) => {
  try {
    const count = await Death.countDocuments({ gender: 'Female' });
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error in fetchTotalFemaleDeathRecords:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteDeathRecord = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Death record ID format." });
    }

    const deletedDeath = await Death.findByIdAndDelete(id);

    if (!deletedDeath) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Error in deleteDeathRecord:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update a Death record
export const updateDeathRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { birth, image, dateOfDeath, causeOfDeath, placeOfDeath } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Death record ID format." });
    }

    if (!mongoose.Types.ObjectId.isValid(birth)) {
      return res.status(400).json({ message: "Invalid birth certificate ID format." });
    }

    const birthRecord = await Birth.findById(birth);
    if (!birthRecord) {
      return res.status(400).json({ message: "Person does not exist. Provide a valid birth certificate ID." });
    }

    if (!mongoose.Types.ObjectId.isValid(placeOfDeath)) {
      return res.status(400).json({ message: "Invalid district ID for placeOfDeath." });
    }

    const placeOfDeathDistrict = await District.findById(placeOfDeath);
    if (!placeOfDeathDistrict) {
      return res.status(400).json({ message: "District ID for placeOfDeath is not found." });
    }

    const updatedData = {
      birth: birthRecord._id,
      image,
      dateOfDeath,
      causeOfDeath,
      placeOfDeath: placeOfDeathDistrict._id,
    };

    const updatedDeath = await Death.findByIdAndUpdate(id, updatedData, { new: true })
      .populate('placeOfDeath', 'discName')
      .populate('birth', 'dobId fullName');

    if (!updatedDeath) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json(updatedDeath);
  } catch (error) {
    console.error("Error in updateDeathRecord:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all Death records
export const getAllDeathRecords = async (req, res) => {
  try {
    const deathRecords = await Death.find()
      .populate({
        path: 'birth',
        select: 'fullName dobId motherName gender occupation dob address', // Select required fields
        populate: { path: 'address', model: District, select: 'discName' } // Populate the address field from District model
      })
      .populate({
        path: 'placeOfDeath',
        select: 'discName' // Get district name for placeOfDeath
      });

    res.status(200).json(deathRecords);
  } catch (error) {
    console.error("Error fetching Death records:", error);
    res.status(500).json({ message: error.message });
  }
};

// Fetch a single Death record by ID with all related data
export const fetchDeathRecordDetails = async (req, res) => {
  const { dod_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(dod_id)) {
    return res.status(400).json({ message: 'Invalid Death ID format' });
  }

  try {
    const deathRecord = await Death.findById(dod_id)
      .populate({
        path: 'birth',
        select: 'fullName dobId motherName gender occupation dob address',
        populate: { path: 'address', model: District, select: 'discName' } // Populate address field
      })
      .populate({
        path: 'placeOfDeath',
        select: 'discName' // Populate placeOfDeath from District model
      });

    if (!deathRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Structure the response properly
    const responseData = {
      deathSequenceID: deathRecord.id,
      image: deathRecord.image,
      dateOfDeath: deathRecord.dateOfDeath,
      causeOfDeath: deathRecord.causeOfDeath,
      placeOfDeath: deathRecord.placeOfDeath ? deathRecord.placeOfDeath.discName : 'N/A',
      fullName: deathRecord.birth ? deathRecord.birth.fullName : 'N/A',
      dobSequenceID: deathRecord.birth ? deathRecord.birth.dobId : 'N/A',
      motherName: deathRecord.birth ? deathRecord.birth.motherName : 'N/A',
      gender: deathRecord.birth ? deathRecord.birth.gender : 'N/A',
      dateOfBirth: deathRecord.birth ? deathRecord.birth.dob : 'N/A',
      address: deathRecord.birth && deathRecord.birth.address ? deathRecord.birth.address.discName : 'N/A',
      occupation: deathRecord.birth ? deathRecord.birth.occupation : 'N/A',
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching Death record details:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all approved Death records
export const getApprovedDeathRecords = async (req, res) => {
  try {
    const approvedDeathRecords = await Death.find({ paymentStatus: 1 })
      .populate({
        path: 'birth',
        select: 'fullName dobId' // Populate birth details
      })
      .populate({
        path: 'placeOfDeath',
        select: 'discName' // Populate placeOfDeath from District model
      });

    res.status(200).json(approvedDeathRecords);
  } catch (error) {
    console.error("Error fetching approved Death records:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all pending Death records
export const getPendingDeathRecords = async (req, res) => {
  try {
    const pendingDeathRecords = await Death.find({ paymentStatus: 0 })
      .populate({
        path: 'birth',
        select: 'fullName dobId'
      })
      .populate({
        path: 'placeOfDeath',
        select: 'discName'
      });

    res.status(200).json(pendingDeathRecords);
  } catch (error) {
    console.error("Error fetching pending Death records:", error);
    res.status(500).json({ message: error.message });
  }
};

