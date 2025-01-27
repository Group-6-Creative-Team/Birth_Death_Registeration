import Dod from '../models/dodModel.js';
import District from '../models/districtsModel.js';
import Dob from '../models/dobModel.js'; 
import mongoose from 'mongoose';

// Create a new district
export const createDistrict = async (req, res) => {
  try {
    // Find the last district entry to get the current max id
    const lastDistrict = await District.findOne().sort({ id: -1 });

    // Increment id by 1 based on the last district entry, or start at 101 if none exist
    const newId = lastDistrict ? lastDistrict.id + 1 : 101;

    // Create a new district with the incremented id
    const newDistrict = new District({
      id: newId,
      discName: req.body.discName,
    });

    // Save the new district to the database
    const savedDistrict = await newDistrict.save();
    res.status(201).json(savedDistrict);
  } catch (error) {
    console.error("Error creating district:", error);
    res.status(500).json({ message: "Failed to create district" });
  }
};

// Get all districts
export const getAllDistricts = async (req, res) => {
  try {
    const districts = await District.find();
    res.status(200).json(districts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific district by ID
export const getDistrictById = async (req, res) => {
  try {
    const district = await District.findById(req.params.id);
    if (!district) return res.status(404).json({ message: "District not found" });
    res.status(200).json(district);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a district by ID
export const updateDistrict = async (req, res) => {
  try {
    const updatedDistrict = await District.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDistrict) return res.status(404).json({ message: "District not found" });
    res.status(200).json(updatedDistrict);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a district by ID
export const deleteDistrict = async (req, res) => {
  try {
    const deletedDistrict = await District.findByIdAndDelete(req.params.id);
    if (!deletedDistrict) return res.status(404).json({ message: "District not found" });
    res.status(200).json({ message: "District deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBirthsAndDeathsByDistrict = async (req, res) => {
  try {
    const births = await Dob.aggregate([
      {
        $addFields: {
          placeOfBirth: { $toObjectId: "$placeOfBirth" } // Convert placeOfBirth to ObjectId
        }
      },
      {
        $lookup: {
          from: "districts", // Replace with the actual name of your districts collection
          localField: "placeOfBirth",
          foreignField: "_id",
          as: "districtInfo"
        }
      },
      {
        $unwind: {
          path: "$districtInfo",
          preserveNullAndEmptyArrays: true // Optional: if you want to keep records without matching districts
        }
      },
      {
        $group: {
          _id: "$districtInfo.discName", // Assuming discName holds the name of the district
          totalBirths: { $sum: 1 }
        }
      }
    ]);
    console.log(births);

    const deaths = await Dod.aggregate([
      {
        $addFields: {
          placeOfDeath: { $toObjectId: "$placeOfDeath" } // Convert placeOfDeath to ObjectId
        }
      },
      {
        $lookup: {
          from: "districts", // Replace with the actual name of your districts collection
          localField: "placeOfDeath",
          foreignField: "_id",
          as: "districtInfo"
        }
      },
      {
        $unwind: {
          path: "$districtInfo",
          preserveNullAndEmptyArrays: true // Optional: if you want to keep records without matching districts
        }
      },
      {
        $group: {
          _id: "$districtInfo.discName", // Assuming discName holds the name of the district
          totalDeaths: { $sum: 1 }
        }
      }
    ]);
    console.log(deaths);

    res.status(200).json({ births, deaths });
  } catch (error) {
    console.error("Error fetching birth and death data:", error);
    res.status(500).json({ message: error.message });
  }
};