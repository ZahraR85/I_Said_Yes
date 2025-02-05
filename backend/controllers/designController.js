import Design from "../models/design.js";

// Get all designs
export const getDesigns = async (req, res, next) => {
  try {
    const designs = await Design.find();
    res.json(designs);
  } catch (error) {
    next(error);
  }
};

// Get a single design item by ID
export const getDesignById = async (req, res, next) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }
    res.json(design);
  } catch (error) {
    next(error);
  }
};

// Create a new design
export const createDesign = async (req, res) => {
  const { userId, category, itemName, price, description} = req.body;
  if (!category || !itemName || !price || !userId || !req.file) {
    return res.status(400).json({ error: "Missing required fields or image file" });
  }

  try {
    const newItem = new Design({
      userId: userId,
      category,
      itemName,
      price,
      description,
      imagePath: req.cloudinaryURL,
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error saving design item:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update an existing design
export const updateDesign = async (req, res, next) => {
  try {
    const design = await Design.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }
    res.json(design);
  } catch (error) {
    next(error);
  }
};

// Delete a design
export const deleteDesign = async (req, res, next) => {
  try {
    const design = await Design.findByIdAndDelete(req.params.id);
    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }
    res.json({ message: "Design deleted successfully" });
  } catch (error) {
    next(error);
  }
};
