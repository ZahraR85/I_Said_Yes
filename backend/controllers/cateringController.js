import Catering from "../models/catering.js";

// Get all catering items
export const getCateringItems = async (req, res) => {
  try {
    const items = await Catering.find().populate('userId', 'ItemName');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new catering item
export const addCateringItem = async (req, res) => {
  const { userId, category, ItemName, price, VariantDescription} = req.body;

  if (!category || !ItemName || !price || !userId || !req.file) {
    return res.status(400).json({ error: "Missing required fields or image file" });
  }

  try {
    const newItem = new Catering({
      userId: userId,
      category,
      ItemName,
      price,
      VariantDescription,
      imagePath: req.cloudinaryURL,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error saving catering item:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a catering item
export const deleteCateringItem = async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const deletedItem = await Catering.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Catering item not found" });
    }
    res.status(200).json({ message: "Catering item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a catering item
export const updateCateringItem = async (req, res) => {
  const { id } = req.params;
  const { userId, category, ItemName, price, VariantDescription, keepExistingImage } = req.body;

  const updateData = {
    userId,
    category,
    ItemName,
    price,
    VariantDescription,
  };

  if (keepExistingImage !== "true" && req.file) {
    updateData.imagePath = req.cloudinaryURL;
  }

  try {
    const updatedItem = await Catering.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating catering item:", error);
    res.status(500).send("Error updating catering item");
  }
};

// Get catering items by category
export const getCateringByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const items = await Catering.find({
      category: { $regex: new RegExp(`^${category}$`, "i") },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
