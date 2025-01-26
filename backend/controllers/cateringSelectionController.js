import cateringSelection from "../models/cateringSelection.js";

// Fetch catering selection for a specific user
export const getCateringSelection = async (req, res) => {
  const { userId } = req.params;

  try {
    const cateringSelection1 = await cateringSelection.findOne({ userId }).populate(
      "selectedItems.items.cateringItemId"
    );

    if (!cateringSelection1) {
      return res.status(404).json({ error: "No catering selection found for this user." });
    }

    res.status(200).json(cateringSelection1);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch catering selection." });
  }
};

// Save or update catering selection for a user
export const saveCateringSelection = async (req, res) => {
  const { userId } = req.params;
  const { selectedItems, grandTotal } = req.body;

  try {
    const existingRecord = await cateringSelection.findOne({ userId });

    if (existingRecord) {
      // Update the existing record
      existingRecord.selectedItems = selectedItems;
      existingRecord.grandTotal = grandTotal;
      await existingRecord.save();
      return res.status(200).json({ message: "Catering selection updated successfully." });
    }

    // Create a new record if none exists
    const newRecord = new cateringSelection({
      userId,
      selectedItems,
      grandTotal,
    });
    await newRecord.save();

    res.status(201).json({ message: "Catering selection saved successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save catering selection." });
  }
};

// Delete a catering selection for a user (optional)
export const deleteCateringSelection = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedRecord = await cateringSelection.findOneAndDelete({ userId });

    if (!deletedRecord) {
      return res.status(404).json({ error: "No catering selection found to delete." });
    }

    res.status(200).json({ message: "Catering selection deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete catering selection." });
  }
};
