import Makeup from "../models/makeup.js";
import mongoose from "mongoose";

export const createOrUpdateMakeup = async (req, res) => {
  try {
    const { userID, makeup, hairstyle, dyeHair, nail, eyelashExtensions, special } = req.body;
    let makeupData = await Makeup.findOne({ userID });

    if (makeupData) {
      // Update existing data
      makeupData.makeup = makeup;
      makeupData.hairstyle = hairstyle;
      makeupData.dyeHair = dyeHair;
      makeupData.nail.selected = nail;
      makeupData.eyelashExtensions.selected = eyelashExtensions;
      makeupData.special.selected = special;
      await makeupData.save();
    } else {
      // Create new data
      makeupData = new Makeup(req.body);
      await makeupData.save();
    }

    res.status(200).json({ message: "Makeup data saved successfully.", data: makeupData });
  } catch (error) {
    console.error("Error saving makeup data", error);
    res.status(500).json({ message: "Failed to save makeup data" });
  }
};

export const getMakeups = async (req, res) => {
  try {
    const userID = req.query.userID || req.body.userID;

    if (!userID) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const makeup = await Makeup.findOne({ userID }).populate('userID', 'name family');

    if (!makeup) {
      return res.status(404).json({ message: "No selections found for this user" });
    }

    res.status(200).json(makeup);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user selections", error });
  }
};

export const getMakeupById = async (req, res) => {
  try {
    const { id } = req.params;
    const makeup = await Makeup.findById(id).populate("userID");

    if (!makeup) {
      return res.status(404).json({ message: "Makeup not found" });
    }

    res.status(200).json(makeup);
  } catch (error) {
    res.status(500).json({ message: "Error fetching makeup", error });
  }
};

export const updateMakeup = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Update data without touching the `total` field, since it's calculated automatically
    const makeup = await Makeup.findByIdAndUpdate(id, updatedData, { new: true });

    if (!makeup) {
      return res.status(404).json({ message: "Makeup not found" });
    }

    res.status(200).json({ message: "Makeup updated successfully", makeup });
  } catch (error) {
    res.status(500).json({ message: "Error updating makeup", error });
  }
};

export const deleteMakeup = async (req, res) => {
  try {
    const { id } = req.params;

    const makeup = await Makeup.findByIdAndDelete(id);

    if (!makeup) {
      return res.status(404).json({ message: "Makeup not found" });
    }

    res.status(200).json({ message: "Makeup deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting makeup", error });
  }
};
