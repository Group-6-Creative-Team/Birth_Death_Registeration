import Birth from '../models/birth.js';
import District from '../models/districtsModel.js';

// Create a new date of birth record
export const createBirthRecord = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);
    const { fullName, image, placeOfBirth, dob, gender, materialState, address, motherName, occupation } = req.body;
 
    const allDistricts = await District.find({});
    console.log("Available Districts:", allDistricts.map(d => ({ id: d._id, name: d.discName })));

    const trimmedPlaceOfBirth = placeOfBirth.trim();
    const trimmedAddress = address.trim();

    const placeOfBirthDistrict = await District.findOne({ _id: trimmedPlaceOfBirth });
    const addressDistrict = await District.findOne({ _id: trimmedAddress });

    if (!placeOfBirthDistrict || !addressDistrict) {
      console.log("Invalid District IDs:", { placeOfBirth, address });
      return res.status(400).json({ message: "Invalid district name(s) for placeOfBirth or address" });
    }

    // Find the last record and calculate new birthId
    const lastRecord = await Birth.findOne().sort({ dobId: -1 });
    const newdobId = lastRecord && lastRecord.dobId ? lastRecord.dobId + 1 : 101;

    if (isNaN(newdobId)) {
      console.error("Error: birthId is NaN");
      return res.status(500).json({ message: "Failed to generate a valid birthId" });
    }

    const dateOfIssue = new Date();
    const expirationDate = new Date(dateOfIssue);
    expirationDate.setFullYear(dateOfIssue.getFullYear() + 1);

    if (typeof image !== 'string') {
      return res.status(400).json({ message: 'Image must be a string' });
    }
    const newBirth = new Birth({
      dobId: newdobId,
      fullName,
      image,
      placeOfBirth: placeOfBirthDistrict._id,
      dob,
      gender,
      materialState,
      address: addressDistrict._id,
      motherName,
      dateOfIssue,
      occupation,
      expirationDate,
      paymentStatus: 0
    });

    const savedBirth = await newBirth.save();
    res.status(201).json(savedBirth);
  } catch (error) {
    console.error("Error in createBirthRecord:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all birth records
export const getAllBirthRecords = async (req, res) => {
  try {
    const birthRecords = await Birth.find()
      .populate('placeOfBirth', 'discName')  // Populate only `discName` for placeOfBirth
      .populate('address', 'discName')       // Populate only `discName` for address
      .select('-__v');  // Exclude the `__v` field from the response

    const formattedRecords = birthRecords.map(record => ({
      ...record._doc,
      dateOfIssue: record.dateOfIssue.toISOString().split('T')[0],
      expirationDate: record.expirationDate.toISOString().split('T')[0],
      dob: record.dob.toISOString().split('T')[0],
    }));

    res.status(200).json(formattedRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single birth record by ID
export const getBirthRecordById = async (req, res) => {
  try {
    const birthRecord = await Birth.findById(req.params.id)
      .populate('placeOfBirth address', 'discName')
      .select('-__v');

    if (!birthRecord) return res.status(404).json({ message: "Record not found" });

    const formattedRecord = {
      ...birthRecord._doc,
      dateOfIssue: birthRecord.dateOfIssue.toISOString().split('T')[0],
      expirationDate: birthRecord.expirationDate.toISOString().split('T')[0],
      dob: birthRecord.dob.toISOString().split('T')[0]
    };

    res.status(200).json(formattedRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a birth record
export const updateBirthRecord = async (req, res) => {
  try {
    const { placeOfBirth, address, ...otherUpdates } = req.body;

    // Check if placeOfBirth is a valid district ID
    if (placeOfBirth) {
      const placeOfBirthDistrict = await District.findById(placeOfBirth.trim());
      if (!placeOfBirthDistrict) {
        return res.status(400).json({ message: "Invalid district ID for placeOfBirth" });
      }
      otherUpdates.placeOfBirth = placeOfBirthDistrict._id;
    }

    // Check if address is a valid district ID
    if (address) {
      const addressDistrict = await District.findById(address.trim());
      if (!addressDistrict) {
        return res.status(400).json({ message: "Invalid district ID for address" });
      }
      otherUpdates.address = addressDistrict._id;
    }

    // Update the record in the database
    const updatedBirth = await Birth.findByIdAndUpdate(req.params.id, otherUpdates, { new: true })
      .populate('placeOfBirth address', 'discName')
      .select('-__v');

    if (!updatedBirth) return res.status(404).json({ message: "Record not found" });

    const formattedRecord = {
      ...updatedBirth._doc,
      dateOfIssue: updatedBirth.dateOfIssue.toISOString().split('T')[0],
      expirationDate: updatedBirth.expirationDate.toISOString().split('T')[0],
      dob: updatedBirth.dob.toISOString().split('T')[0]
    };

    res.status(200).json(formattedRecord);
  } catch (error) {
    console.error("Error in updateBirthRecord:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a birth record
export const deleteBirthRecord = async (req, res) => {
  try {
    const deletedBirth = await Birth.findByIdAndDelete(req.params.id);
    if (!deletedBirth) return res.status(404).json({ message: "Record not found" });

    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all approved birth records (paymentStatus = 1)
export const getApprovedBirthRecords = async (req, res) => {
  try {
    const approvedBirthRecords = await Birth.find({ paymentStatus: 1 })
      .populate('placeOfBirth', 'discName')
      .populate('address', 'discName')
      .select('-__v');

    const formattedRecords = approvedBirthRecords.map(record => ({
      ...record._doc,
      dateOfIssue: record.dateOfIssue.toISOString().split('T')[0],
      expirationDate: record.expirationDate.toISOString().split('T')[0],
      dob: record.dob.toISOString().split('T')[0],
    }));

    res.status(200).json(formattedRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all pending birth records (paymentStatus = 0)
export const getPendingBirthRecords = async (req, res) => {
  try {
    const pendingRecords = await Birth.find({ paymentStatus: 0 })
      .populate('placeOfBirth', 'discName')
      .populate('address', 'discName')
      .select('-__v');

    const formattedRecords = pendingRecords.map(record => ({
      ...record._doc,
      dateOfIssue: record.dateOfIssue.toISOString().split('T')[0],
      expirationDate: record.expirationDate.toISOString().split('T')[0],
      dob: record.dob.toISOString().split('T')[0],
    }));

    res.status(200).json(formattedRecords);
  } catch (error) {
    console.error("Error fetching pending records:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getBirthRecordDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Use nested population to fetch `discName` of `address` and `placeOfBirth`
    const birthRecord = await Birth.findById(id)
      .populate({
        path: 'placeOfBirth',
        model: District, // Assuming placeOfBirth references District collection
        select: 'discName', // Select only the discName field
      })
      .populate({
        path: 'address',
        model: District, // Assuming address references District collection
        select: 'discName', // Select only the discName field
      })
      .select('-__v'); // Exclude version key

    if (!birthRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Format the response to include `discName` values
    const formattedRecord = {
      fullName: birthRecord.fullName,
      image: birthRecord.image,
      dateOfBirth: birthRecord.dob.toISOString().split('T')[0], // Format to YYYY-MM-DD
      placeOfBirth: birthRecord.placeOfBirth ? birthRecord.placeOfBirth.discName : 'N/A',
      idNumber: birthRecord.birthId,
      gender: birthRecord.gender,
      maritalStatus: birthRecord.materialState || 'N/A', // Ensure it's defined
      address: birthRecord.address ? birthRecord.address.discName : 'N/A',
      motherName: birthRecord.motherName || 'N/A',
      dateOfIssue: birthRecord.dateOfIssue.toISOString().split('T')[0],
      occupation: birthRecord.occupation || 'N/A',
      photo: birthRecord.image || '/default-image.png', // Fallback image if not provided
      mayorName: 'Cumar Maxamuud Maxamed', // Static value for now
    };

    res.status(200).json(formattedRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getTotalBirthRecords = async (req, res) => {
  try {
    const totalBirthRecords = await Birth.countDocuments();
    res.status(200).json({ totalBirthRecords });
  } catch (error) {
    console.error("Error in getTotalBirthRecords:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get total approved birth records
export const getTotalApprovedBirthRecords = async (req, res) => {
  try {
    const totalApprovedBirthRecords = await Birth.countDocuments({ paymentStatus: 1 });
    res.status(200).json({ totalApprovedBirthRecords });
  } catch (error) {
    console.error("Error in getTotalApprovedBirthRecords:", error);
    res.status(500).json({ message: error.message });
  }
};

export const fetchTotalMaleBirthRecords = async (req, res) => {
  try {
    const count = await Birth.countDocuments({ gender: 'Male' }); // Assuming 'gender' field holds the value 'Male'
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error in fetchTotalMaleBirthRecords:", error);
    res.status(500).json({ message: error.message });
  }
};

export const fetchTotalFemaleBirthRecords = async (req, res) => {
  try {
    const count = await Birth.countDocuments({ gender: 'Female' }); // Assuming 'gender' field holds the value 'Female'
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error in fetchTotalFemaleBirthRecords:", error);
    res.status(500).json({ message: error.message });
  }
};
