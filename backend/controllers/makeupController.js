import Makeup from "../models/makeup.js";
import mongoose from "mongoose";

export const createOrUpdateMakeup = async (req, res) => {
  try {
    const { userID, makeup, dyeHair, nail, hairstyle, EyelashExtensions, special } = req.body;

    // Ensure userID is provided
    if (!userID) {
      return res.status(400).json({ message: "UserID is required." });
    }

    // Default values for makeup options
    const makeupPrices = { Budget: 150, Luxury: 300, VIP: 500 };
    const hairstylePrices = { "Simple Shenyun": 100, "Complex Shenyun": 150, Babyliss: 100, "Extra Hair Extension": 150 };
    const dyeHairPrices = {
      "Highlights Short": 80, "Highlights Medium": 120, "Highlights Long": 170, "Highlights Very Long": 170,
      "Balayage Short": 100, "Balayage Medium": 200, "Balayage Long": 300, "Balayage Very Long": 400,
      "Full Color Short": 50, "Full Color Medium": 80, "Full Color Long": 120, "Full Color Very Long": 150,
    };

    // Calculate total makeup price
    const total =
      (makeup && makeupPrices[makeup] ? makeupPrices[makeup] : 0) +
      (dyeHair && dyeHairPrices[dyeHair] ? dyeHairPrices[dyeHair] : 0) +
      (nail ? 70 : 0) +
      (hairstyle && hairstylePrices[hairstyle] ? hairstylePrices[hairstyle] : 0) +
      (EyelashExtensions ? 100 : 0) +
      (special ? 300 : 0);

    // Create the makeup data object
    const updateData = {
      makeup,
      makeupPrice: makeupPrices[makeup] || 150,
      dyeHair,
      dyeHairPrice: dyeHairPrices[dyeHair] || 50,
      nail: { selected: nail || false, price: 70 },
      hairstyle,
      hairstylePrice: hairstylePrices[hairstyle] || 100,
      EyelashExtensions: { selected: EyelashExtensions || false, price: 100 },
      special: { selected: special || false, price: 300 },
      total,
    };

    // Use mongoose's findOneAndUpdate to update or create the makeup entry
    const feature = await Makeup.findOneAndUpdate(
      { userID: new mongoose.Types.ObjectId(userID) },
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: "Makeup updated successfully", feature });
  } catch (error) {
    console.error("Error in createOrUpdateMakeup:", error);
    res.status(500).json({ message: "Error saving makeup data", error });
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
