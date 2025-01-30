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

// Delete a catering item from the selection
export const deleteCateringItem = async (req, res) => {
  try {
    const { userId, cateringItemId } = req.params;

    if (!userId || !cateringItemId) {
      return res.status(400).json({ message: "Invalid request parameters." });
    }

    // Find the catering selection for the user
    const cateringSelectionRecord = await cateringSelection.findOne({ userId });

    if (!cateringSelectionRecord) {
      return res.status(404).json({ message: "Catering selection not found." });
    }

    // Iterate through selectedItems to remove the specific catering item
    cateringSelectionRecord.selectedItems.forEach((category) => {
      category.items = category.items.filter(
        (item) => item.cateringItemId.toString() !== cateringItemId
      );
    });

    // Remove empty categories
    cateringSelectionRecord.selectedItems = cateringSelectionRecord.selectedItems.filter(
      (category) => category.items.length > 0
    );

    // Recalculate grandTotal
    cateringSelectionRecord.grandTotal = cateringSelectionRecord.selectedItems.reduce(
      (total, category) =>
        total +
        category.items.reduce(
          (catTotal, item) => catTotal + item.quantity * item.price,
          0
        ),
      0
    );

    // If no items remain, delete the whole catering selection
    if (cateringSelectionRecord.selectedItems.length === 0) {
      await cateringSelection.findOneAndDelete({ userId });
      return res.status(200).json({ message: "Catering selection deleted." });
    }

    // Save updated selection
    await cateringSelectionRecord.save();
    res.status(200).json({ message: "Item removed successfully.", cateringSelection: cateringSelectionRecord });
  } catch (error) {
    console.error("Error deleting catering item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};