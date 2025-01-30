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
export const deleteCateringItem = async (req, res) => {
  const { userId } = req.params;
  const { cateringItemId } = req.body;

  try {
    const cateringSelection = await cateringSelection.findOne({ userId });

    if (!cateringSelection) {
      return res.status(404).json({ error: "No catering selection found." });
    }

    // Remove the specific item from the selected items
    cateringSelection.selectedItems = cateringSelection.selectedItems.map((category) => {
      category.items = category.items.filter(
        (item) => item.cateringItemId.toString() !== cateringItemId
      );
      return category;
    }).filter(category => category.items.length > 0); // Remove empty categories

    cateringSelection.grandTotal = cateringSelection.selectedItems.reduce(
      (total, category) =>
        total + category.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      0
    );

    if (cateringSelection.selectedItems.length === 0) {
      await cateringSelection.deleteOne(); // If no items remain, delete the entire document
    } else {
      await cateringSelection.save();
    }

    res.status(200).json({ message: "Item removed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove catering item." });
  }
};

