import Death from '../models/death.js';
import District from '../models/districtsModel.js';
import Birth from '../models/dobModel.js';
import mongoose from 'mongoose';

// Get all date of death records

export const createDeathRecord = async (req, res) => {
  try {
    console.log("incoming data" , req.body)
    const { birth, image, dateOfDeath, causeOfDeath, placeOfDeath } = req.body;

    // Check if the provided Birth ID exists
    const birthRecord = await Birth.findById(birth);
    if (!birthRecord) {
      return res.status(400).json({ message: "Person does not exist. Please provide a valid birth certificate ID." });
    }

    // Validate placeOfDeath as a district
    const placeOfDeathDistrict = await District.findById(placeOfDeath);
    if (!placeOfDeathDistrict) {
      return res.status(400).json({ message: "Invalid district ID for placeOfDeath" });
    }

    // Generate auto-incremented ID for Death record
    const lastRecord = await Death.findOne().sort({ id: -1 });
    const newId = lastRecord && lastRecord.id ? lastRecord.id + 1 : 101;

    const newDeath = new Death({
      id: newId,
      birth: birthRecord._id, // Use the ObjectId of the birth record
      image,
      dateOfDeath,
      causeOfDeath,
      placeOfDeath: placeOfDeathDistrict._id,
      paymentStatus: 0 // Default to Pending
    });

    const savedDeath = await newDeath.save();

    // Populate birth to get the full name
    const populatedDeath = await Death.findById(savedDeath._id).populate('birth', 'fullName').populate('placeOfDeath', 'discName');
    res.status(201).json(populatedDeath);
  } catch (error) {
    console.error("Error in createDeathRecord:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllDeathRecords = async (req, res) => {
  try {
    const deathRecords = await Death.find().populate('placeOfDeath', 'discName').populate('birth', 'fullName'); // Only populate `discName` field
    res.status(200).json(deathRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single date of death record by ID

export const getDeathRecordById = async (req, res) => {
  try {
    const deathRecord = await Death.findById(req.params.id)
      .populate('birth', 'fullName')
      .populate('placeOfDeath', 'discName');
    if (!deathRecord) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(deathRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a date of death record

export const updateDeathRecord = async (req, res) => {
  try {
    console.log("incoming data" , req.body)
    console.log("Incoming request body:", req.body);
    const { birth, image, dateOfDeath, causeOfDeath, placeOfDeath } = req.body;

    // Validate the birth ID exists in the Birth collection
    const birthRecord = await Birth.findById(birth);
    if (!birthRecord) {
      return res.status(400).json({ message: "Person does not exist. Please provide a valid birth certificate ID." });
    }

    // Validate the placeOfDeath ID exists in the District collection
    const placeOfDeathDistrict = await District.findById(placeOfDeath);
    if (!placeOfDeathDistrict) {
      return res.status(400).json({ message: "Invalid district ID for placeOfDeath" });
    }

    const updatedData = {
      birth: birthRecord._id, // Use the MongoDB ObjectId for birth
      image,
      dateOfDeath,
      causeOfDeath,
      placeOfDeath: placeOfDeathDistrict._id,
    };

    const updatedDeath = await Death.findByIdAndUpdate(req.params.id, updatedData, { new: true })
      .populate('placeOfDeath', 'discName')
      .populate('birth', 'dobId fullName'); // Populate dobId and fullName for frontend display

    if (!updatedDeath) return res.status(404).json({ message: "Record not found" });

    res.status(200).json(updatedDeath);
  } catch (error) {
    console.error("Error in updateDeathRecord:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a date of death record
export const deleteDeathRecord = async (req, res) => {
  try {
    const deletedDeath = await Death.findByIdAndDelete(req.params.id);
    if (!deletedDeath) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all approved Death records
export const getApprovedDeathRecords = async (req, res) => {
  try {
    const approvedDeathRecords = await Death.find({ paymentStatus: 1 })
      .populate('birth', 'fullName')
      .populate('placeOfDeath', 'discName')
      .select('-__v'); // Exclude the __v field

    res.status(200).json(approvedDeathRecords);
  } catch (error) {
    console.error("Error in getApprovedDeathRecords:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all pending Death records
export const getPendingDeathRecords = async (req, res) => {
  try {
    const pendingDeathRecords = await Death.find({ paymentStatus: 0 })
      .populate('birth', 'fullName')
      .populate('placeOfDeath', 'discName')
      .select('-__v'); // Exclude the __v field

    res.status(200).json(pendingDeathRecords);
  } catch (error) {
    console.error("Error in getPendingDeathRecords:", error);
    res.status(500).json({ message: error.message });
  }
};

export const fetchDeathRecordDetails = async (req, res) => {
  const { death_id } = req.params;
  console.log('Death ID:', death_id);

  if (!mongoose.Types.ObjectId.isValid(death_id)) {
    return res.status(400).json({ message: 'Invalid Death ID format' });
  }

  try {
    // Find the Death record by ID and populate related fields from Birth and District
    const deathRecord = await Death.findById(death_id)
      .select('id image dateOfDeath causeOfDeath placeOfDeath')
      .populate({
        path: 'birth',
        model: Birth,
        select: 'fullName dobId motherName gender occupation dob address',
        populate: {
          path: 'address',
          model: District, // Assuming `address` references District collection for discName
          select: 'discName',
        },
      })
      .populate({
        path: 'placeOfDeath',
        model: District,
        select: 'discName',
      });

    if (!deathRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Prepare response with fields from Death, Birth, and District
    const responseData = {
      deathSequenceID: deathRecord.id,
      image: deathRecord.image,
      dateOfDeath: deathRecord.dateOfDeath,
      causeOfDeath: deathRecord.causeOfDeath,
      placeOfDeath: deathRecord.placeOfDeath ? deathRecord.placeOfDeath.discName : null,
      fullName: deathRecord.birth ? deathRecord.birth.fullName : null,
      dobSequenceID: deathRecord.birth ? deathRecord.birth.dobId : null,
      motherName: deathRecord.birth ? deathRecord.birth.motherName : null,
      gender: deathRecord.birth ? deathRecord.birth.gender : null,
      dateOfBirth: deathRecord.birth ? deathRecord.birth.dob : null,
      address: deathRecord.birth ? deathRecord.birth.address : null,
      occupation: deathRecord.birth ? deathRecord.birth.occupation : null, // Ensure this exists

    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching record details' });
  }
};

// Get total death records
export const getTotalDeathRecords = async (req, res) => {
  try {
    const totalDeathRecords = await Death.countDocuments();
    res.status(200).json({ totalDeathRecords });
  } catch (error) {
    console.error("Error in getTotalDeathRecords:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get total approved death records
export const getTotalApprovedDeathRecords = async (req, res) => {
  try {
    const totalApprovedDeathRecords = await Death.countDocuments({ paymentStatus: 1 });
    res.status(200).json({ totalApprovedDeathRecords });
  } catch (error) {
    console.error("Error in getTotalApprovedDeathRecords:", error);
    res.status(500).json({ message: error.message });
  }
};
 // Adjust the path according to your project structure

export const fetchTotalMaleDeathRecords = async (req, res) => {
  try {
    const count = await Death.aggregate([
      {
        $lookup: {
          from: 'births', // Name of the Birth collection
          localField: 'dobId', // Field in Death that references Birth
          foreignField: '_id', // Field in Birth that is referenced
          as: 'birthDetails', // Name of the array where matched Birth records will be stored
        },
      },
      {
        $unwind: '$birthDetails', // Deconstructs the array to create a separate document for each element
      },
      {
        $match: { 'birthDetails.gender': 'Male' }, // Filter by male gender
      },
      {
        $count: 'count', // Count the resulting documents
      },
    ]);

    // If no male deaths are found, return 0
    const maleDeathCount = count.length > 0 ? count[0].count : 0;
    res.status(200).json({ count: maleDeathCount });
  } catch (error) {
    console.error("Error in fetchTotalMaleDeathRecords:", error);
    res.status(500).json({ message: error.message });
  }
};

export const fetchTotalFemaleDeathRecords = async (req, res) => {
  try {
    const count = await Death.aggregate([
      {
        $lookup: {
          from: 'births', // Name of the Birth collection
          localField: 'dobId', // Field in Death that references Birth
          foreignField: '_id', // Field in Birth that is referenced
          as: 'birthDetails', // Name of the array where matched Birth records will be stored
        },
      },
      {
        $unwind: '$birthDetails', // Deconstructs the array to create a separate document for each element
      },
      {
        $match: { 'birthDetails.gender': 'Female' }, // Filter by female gender
      },
      {
        $count: 'count', // Count the resulting documents
      },
    ]);

    // If no female deaths are found, return 0
    const femaleDeathCount = count.length > 0 ? count[0].count : 0;
    res.status(200).json({ count: femaleDeathCount });
  } catch (error) {
    console.error("Error in fetchTotalFemaleDeathRecords:", error);
    res.status(500).json({ message: error.message });
  }
};