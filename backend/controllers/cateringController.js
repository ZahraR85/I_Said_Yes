import Reception from "../models/reception.js";
import mongoose from "mongoose";

export const createOrUpdateCatering = async (req, res) => {
  try {
    const { userID, Starter, MainCourse, Dessert, ColdDrink, CafeBar, Fruiets, Cake, Waiter } = req.body;

    if (!userID) {
      return res.status(400).json({ message: "UserID is required." });
    }

    // Prepare the data for updating or creating
    const updateData = {
      Starter: { Number: Starter || 0, price: 5 },
      MainCourse: { Number: MainCourse || 0, price: 15 },
      Dessert: { Number: Dessert || 0, price: 6 },
      ColdDrink: { Number: ColdDrink || 0, price: 7 },
      CafeBar: { Number: CafeBar || 0, price: 4 },
      Fruiets: { Number: Fruiets || 0, price: 9 },
      Cake: { Number: Cake || 0, price: 3 },
      Waiter: { Number: Waiter || 0, price: 20 },
    };

    // Calculate the total price based on the number of each item and its price
    const totalPrice = Object.keys(updateData).reduce((total, feature) => {
      return total + updateData[feature].Number * updateData[feature].price;
    }, 0);

    // Add the total price to the data
    updateData.total = totalPrice;



    // Update or create the Catering entry in the database
    const Catering = await Catering.findOneAndUpdate(
      { userID: new mongoose.Types.ObjectId(userID) },
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Check if the Catering object was updated or created
    if (!Catering) {
      return res.status(404).json({ message: "Catering not found or created" });
    }

   
    res.status(200).json({ message: "Catering updated successfully", Catering });
  } catch (error) {
    console.error("Error in createOrUpdateCatering:", error);
    res.status(500).json({ message: "Error saving Catering data", error });
  }
};





// Get all Catering
export const getCatering = async (req, res) => {
  try {
    const userID = req.query.userID || req.body.userID;

    if (!userID) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const Catering = await Catering.findOne({ userID }).populate("userID", "name family");

    if (!Catering) {
      return res.status(404).json({ message: "No Catering found for this user" });
    }

    res.status(200).json(Catering);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Catering", error });
  }
};

// Get a Catering by ID
export const getCateringById = async (req, res) => {
  try {
    const { id } = req.params;

    const Catering = await Catering.findById(id).populate("userID");

    if (!Catering) {
      return res.status(404).json({ message: "Catering not found" });
    }

    res.status(200).json(Catering);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Catering", error });
  }
};

// Update a Catering
export const updateCatering = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const Catering = await Catering.findByIdAndUpdate(id, updatedData, { new: true });

    if (!Catering) {
      return res.status(404).json({ message: "Catering not found" });
    }

    res.status(200).json({ message: "Catering updated successfully", reception });
  } catch (error) {
    res.status(500).json({ message: "Error updating Catering", error });
  }
};

// Delete a Catering
export const deleteCatering = async (req, res) => {
  try {
    const { id } = req.params;

    const Catering = await Catering.findByIdAndDelete(id);

    if (!Catering) {
      return res.status(404).json({ message: "Catering not found" });
    }

    res.status(200).json({ message: "Catering deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Catering", error });
  }
};
