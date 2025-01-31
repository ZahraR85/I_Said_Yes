import Photography from "../models/photography.js";
import mongoose from "mongoose";

// Create or Update Photography
export const createOrUpdatePhotography = async (req, res) => {
  try {
      const { userID, photography, videography, clipConstruction, physicalAlbum, giftImageSize } = req.body;
      const userObjectId = new mongoose.Types.ObjectId(userID);

      const total =
          (photography?.number || 0) * (photography?.price || 150) +
          (videography?.number || 0) * (videography?.price || 100) +
          (clipConstruction?.number || 0) * (clipConstruction?.price || 100) +
          (physicalAlbum?.selected ? (physicalAlbum?.price || 500) : 0) +
          (giftImageSize?.number || 0) * (giftImageSize?.price || 10);

      const updateData = { photography, videography, clipConstruction, physicalAlbum, giftImageSize, total };

      const photographyEntry = await Photography.findOneAndUpdate(
          { userID: userObjectId },
          { $set: updateData },
          { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      res.status(200).json({ message: "Photography data updated successfully", photographyEntry });
  } catch (error) {
      console.error("Error in createOrUpdatePhotography:", error);
      res.status(500).json({ message: "Error updating photography data", error: error.message });
  }
};

// Get All Photography Entries
export const getAllPhotographyEntries = async (req, res) => {
  try {
    const entries = await Photography.find().populate("userID", "name email");
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch photography entries", error: error.message });
  }
};

// Get Photography by User ID
export const getPhotographyByUserId = async (req, res) => {
  const { id: userID } = req.params;
  try {
    if (!userID) {
      return res.status(400).json({ message: "UserID is required." });
    }
    //console.log("getPhotographyByUserId:", userID);
    const entry = await Photography.findOne({ userID: new mongoose.Types.ObjectId(userID) }).populate("userID", "name email");
    // console.log("Database Query Result:", entry);
    if (!entry) {
      return res.status(404).json({ message: "No information has been documented yet!" });
    }

    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: "No information has been documented yet!", error: error.message });
  }
};



export const getPhotographyByQuery = async (req, res) => {
  const { userID } = req.query;

  try {
    console.log("Received userID:", userID);

    // Validate userID format
    if (!userID || !mongoose.Types.ObjectId.isValid(userID)) {
      console.error("Invalid userID format:", userID);
      return res.status(400).json({ 
        message: "Invalid userID. Must be a valid 24-character hexadecimal string." 
      });
    }

    // Convert to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userID);
    console.log("Converted ObjectId:", userObjectId);

    // Query the database
    const entry = await Photography.findOne({ userID: userObjectId }).populate("userID", "name email");
    console.log("Database query criteria:", { userID: userObjectId });
    console.log("Database query result:", entry);

    if (!entry) {
      console.log("No entry found for userID:", userObjectId);
      return res.status(404).json({ message: "No information has been documented yet!" });
    }

    res.status(200).json(entry);
  } catch (error) {
    console.error("Error during getPhotographyByQuery:", error);
    res.status(500).json({ message: "Failed to fetch photography data", error: error.message });
  }
};
