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

// Add a catering item to the cateringUser order
export const addCateringItemToCateringUser = async (req, res) => {
  const { userId, items } = req.body;

  try {
    // Check if user exists, and handle if no user found
    const cateringUser = await CateringUser.findOne({ userId });

    if (!cateringUser) {
      // Create a new catering user if not exists
      const newCateringUser = new CateringUser({
        userId,
        selectedItems: items,
        grandTotal: items.reduce((acc, item) => acc + item.totalPrice, 0),
      });
      await newCateringUser.save();
      return res.status(201).json({ message: "Catering order saved", cateringUser: newCateringUser });
    }

    // Iterate over the items to check for duplicates
    for (let item of items) {
      const existingItemIndex = cateringUser.selectedItems.findIndex(
        (existingItem) => existingItem.CateringItemID.toString() === item.CateringItemID.toString()
      );

      // If item already exists, update its quantity and price instead of adding a new item
      if (existingItemIndex !== -1) {
        const existingItem = cateringUser.selectedItems[existingItemIndex];
        existingItem.quantity += item.quantity; // Increase quantity
        existingItem.totalPrice += item.totalPrice; // Increase total price
        existingItem.description = item.description; // Update description

        // Recalculate the grand total
        cateringUser.grandTotal += item.totalPrice;

        await cateringUser.save();
        return res.status(200).json({ message: "Catering order updated", cateringUser });
      }
    }

    // If no duplicates found, add new items to the user's order
    cateringUser.selectedItems = [...cateringUser.selectedItems, ...items];
    cateringUser.grandTotal += items.reduce((acc, item) => acc + item.totalPrice, 0);

    await cateringUser.save();
    return res.status(200).json({ message: "Catering order updated", cateringUser });

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
