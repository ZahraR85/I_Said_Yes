import Catering from "../models/catering.js";

// Add a new catering item
export const addCateringItem = async (req, res) => {
  try {
    const cateringItem = new Catering(req.body);
    await cateringItem.save();
    res.status(201).json({ message: "Catering item added successfully", cateringItem });
  } catch (error) {
    console.error("Error adding catering item:", error);
    res.status(500).json({ message: "Failed to add catering item", error });
  }
};

// Get all catering items
export const getCateringItems = async (req, res) => {
  try {
    const cateringItems = await Catering.find();
    res.status(200).json(cateringItems);
  } catch (error) {
    console.error("Error fetching catering items:", error);
    res.status(500).json({ message: "Failed to fetch catering items", error });
  }
};

// Update a catering item
export const updateCateringItem = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedItem = await Catering.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ message: "Catering item not found" });
    }
    res.status(200).json({ message: "Catering item updated successfully", updatedItem });
  } catch (error) {
    console.error("Error updating catering item:", error);
    res.status(500).json({ message: "Failed to update catering item", error });
  }
};

// Delete a catering item
export const deleteCateringItem = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await Catering.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Catering item not found" });
    }
    res.status(200).json({ message: "Catering item deleted successfully", deletedItem });
  } catch (error) {
    console.error("Error deleting catering item:", error);
    res.status(500).json({ message: "Failed to delete catering item", error });
  }
};
