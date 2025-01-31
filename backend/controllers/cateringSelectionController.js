import CateringSelection from "../models/cateringSelection.js";  // Correct import
import catering from "../models/catering.js"; 

// Fetch catering selection for a specific user
export const getCateringSelection = async (req, res) => {
  const { userId } = req.params;

  try {
    const cateringSelection = await CateringSelection.findOne({ userId }).populate(
      "selectedItems.items.cateringItemId"
    );

    if (!cateringSelection) {
      return res.status(404).json({ error: "No catering selection found for this user." });
    }

    res.status(200).json(cateringSelection);
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
    const existingRecord = await CateringSelection.findOne({ userId });

    if (existingRecord) {
      // Update the existing record
      existingRecord.selectedItems = selectedItems;
      existingRecord.grandTotal = grandTotal;
      await existingRecord.save();
      return res.status(200).json({ message: "Catering selection updated successfully." });
    }

    // Create a new record if none exists
    const newRecord = new CateringSelection({
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
  const { userId, cateringItemId } = req.params;
  console.log("Received DELETE request for:", { userId, cateringItemId });

  try {
    const cateringSelection = await CateringSelection.findOne({
      userId: userId,
      "selectedItems.items.cateringItemId": cateringItemId,
    });

    if (!cateringSelection) {
      console.log("No catering selection found.");
      return res.status(404).json({ message: "Catering selection not found." });
    }

    // Find the index of the item with the given cateringItemId
    let itemIndex = -1;
    cateringSelection.selectedItems.forEach((category, categoryIndex) => {
      itemIndex = category.items.findIndex(
        (item) => item.cateringItemId.toString() === cateringItemId
      );
      if (itemIndex !== -1) {
        // Remove the item from the category's items array
        cateringSelection.selectedItems[categoryIndex].items.splice(itemIndex, 1);
      }
    });

    if (itemIndex === -1) {
      console.log("Item not found in any category.");
      return res.status(404).json({ message: "Item not found in any category." });
    }

    // Save the updated CateringSelection
    await cateringSelection.save();

    console.log("Item deleted successfully.");
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error.message);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};