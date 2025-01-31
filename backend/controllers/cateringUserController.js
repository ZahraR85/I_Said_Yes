import CateringUser from "../models/cateringUser.js";
import Catering from "../models/catering.js";

// Get a user's catering items (cateringUser)
export const getCateringUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const cateringUser = await CateringUser.findOne({ userId });
    if (!cateringUser) {
      return res.status(404).json({ message: "Catering order not found for this user" });
    }

    res.status(200).json(cateringUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a catering item to the cateringUser order
export const addCateringItemToCateringUser = async (req, res) => {
  const { userId, cateringItemId, quantity, description } = req.body;

  try {
    const cateringItem = await Catering.findById(cateringItemId);
    if (!cateringItem) {
      return res.status(404).json({ message: "Catering item not found" });
    }

    const totalPrice = cateringItem.price * quantity;

    const existingCateringUser = await CateringUser.findOne({ userId });
    if (existingCateringUser) {
      existingCateringUser.selectedItems.push({
        CateringItemID: cateringItemId,
        quantity,
        totalPrice,
        description,
      });
      existingCateringUser.grandTotal += totalPrice;
      await existingCateringUser.save();
    } else {
      const newCateringUser = new CateringUser({
        userId,
        selectedItems: [{
          CateringItemID: cateringItemId,
          quantity,
          totalPrice,
          description,
        }],
        grandTotal: totalPrice,
      });
      await newCateringUser.save();
    }

    res.status(201).json({ message: "Catering item added to cateringUser order", cateringUser: existingCateringUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update catering item in cateringUser order (quantity, description)
export const updateCateringItemInCateringUser = async (req, res) => {
  const { userId, cateringItemId, quantity, description } = req.body;

  try {
    const cateringItem = await Catering.findById(cateringItemId);
    if (!cateringItem) {
      return res.status(404).json({ message: "Catering item not found" });
    }

    const cateringUser = await CateringUser.findOne({ userId });
    if (!cateringUser) {
      return res.status(404).json({ message: "Catering order not found for this user" });
    }

    const itemIndex = cateringUser.selectedItems.findIndex(item => item.CateringItemID.toString() === cateringItemId.toString());
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in user's catering order" });
    }

    const oldItem = cateringUser.selectedItems[itemIndex];
    const oldTotalPrice = oldItem.totalPrice;

    oldItem.quantity = quantity;
    oldItem.description = description;
    oldItem.totalPrice = cateringItem.price * quantity;

    // Update the grand total
    cateringUser.grandTotal = cateringUser.grandTotal - oldTotalPrice + oldItem.totalPrice;

    await cateringUser.save();
    res.status(200).json({ message: "Item updated in cateringUser order", cateringUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
