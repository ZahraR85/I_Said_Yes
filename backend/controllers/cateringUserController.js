import CateringUser from "../models/cateringUser.js";
import Catering from "../models/catering.js";

// Get a user's catering items
export const getCateringUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const cateringUser = await CateringUser.findOne({ userId }).populate("items.cateringItemId");
    if (!cateringUser) {
      return res.status(404).json({ message: "Catering order not found for this user" });
    }

    res.status(200).json(cateringUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add or update catering items in CateringUser
// Add item to the user's catering order
export const addCateringItemToCateringUser = async (req, res) => {
  const { userId, items } = req.body;

  try {
    let cateringUser = await CateringUser.findOne({ userId });

    if (!cateringUser) {
      // Create a new catering order if the user doesn't have one
      cateringUser = new CateringUser({
        userId,
        items,
        grandTotal: items.reduce((total, item) => total + item.price * item.quantity, 0),
      });
    } else {
      // Add new items or update existing ones
      items.forEach(item => {
        const existingItem = cateringUser.items.find(
          (existingItem) => existingItem.cateringItemId.toString() === item.cateringItemId.toString()
        );

        if (existingItem) {
          existingItem.quantity += item.quantity;
          existingItem.description = item.description;
        } else {
          cateringUser.items.push(item);
        }
      });

      cateringUser.grandTotal = cateringUser.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    await cateringUser.save();
    res.status(200).json({ message: "Item added successfully", cateringUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete item from the user's catering order
export const deleteCateringItemFromUser = async (req, res) => {
  const { userId, cateringItemId } = req.params;

  try {
    const cateringUser = await CateringUser.findOne({ userId });

    if (!cateringUser) {
      return res.status(404).json({ message: "Catering order not found" });
    }

    cateringUser.items = cateringUser.items.filter(
      (item) => item.cateringItemId.toString() !== cateringItemId
    );

    cateringUser.grandTotal = cateringUser.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cateringUser.save();
    res.status(200).json({ message: "Item removed successfully", cateringUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update item in the user's catering order
export const updateCateringItemInUser = async (req, res) => {
  const { userId, cateringItemId } = req.params;
  const { quantity, description } = req.body;

  try {
    const cateringUser = await CateringUser.findOne({ userId });

    if (!cateringUser) {
      return res.status(404).json({ message: "Catering order not found" });
    }

    const item = cateringUser.items.find(
      (item) => item.cateringItemId.toString() === cateringItemId
    );

    if (item) {
      item.quantity = quantity;
      item.description = description;
      cateringUser.grandTotal = cateringUser.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await cateringUser.save();
      res.status(200).json({ message: "Item updated successfully", cateringUser });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};