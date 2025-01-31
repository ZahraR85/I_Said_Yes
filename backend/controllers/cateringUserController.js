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
  const { userId, items } = req.body;

  console.log("Request body:", req.body); // Log request body to check the structure

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "No items provided or items is not an array" });
  }

  try {
    // Find the existing catering user
    let cateringUser = await CateringUser.findOne({ userId });

    if (!cateringUser) {
      // Create a new catering user if not exists
      cateringUser = new CateringUser({
        userId,
        selectedItems: items,
        grandTotal: items.reduce((acc, item) => acc + item.totalPrice, 0),
      });
      await cateringUser.save();
      return res.status(201).json({ message: "Catering order saved", cateringUser });
    }

    // If the catering user exists, update the selected items
    items.forEach(item => {
      const existingItemIndex = cateringUser.selectedItems.findIndex(existingItem => existingItem.CateringItemID.toString() === item.CateringItemID.toString());

      if (existingItemIndex !== -1) {
        // Update the existing item
        const existingItem = cateringUser.selectedItems[existingItemIndex];
        existingItem.quantity += item.quantity;
        existingItem.totalPrice = existingItem.quantity * (existingItem.totalPrice / existingItem.quantity);  // Adjust price based on quantity
        existingItem.description = item.description;
      } else {
        // If item doesn't exist, add it
        cateringUser.selectedItems.push(item);
      }
    });

    // Recalculate the grandTotal
    cateringUser.grandTotal = cateringUser.selectedItems.reduce((acc, item) => acc + item.totalPrice, 0);

    // Save the updated catering order
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



// Function to save catering user data
export const saveCateringUser = async (req, res) => {
  const { userId, items } = req.body;

  // Validate the request data
  if (!userId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Invalid data: Missing userId or items' });
  }

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Process the items, including total price
    const updatedItems = [];
    let totalOrderPrice = 0;

    for (const item of items) {
      const { CateringItemID, quantity, description } = item;

      // Fetch the catering item details
      const cateringItem = await CateringItem.findById(CateringItemID);
      if (!cateringItem) {
        return res.status(404).json({ message: `Catering item with ID ${CateringItemID} not found` });
      }

      // Calculate total price for this item based on quantity
      const itemTotalPrice = cateringItem.price * quantity;

      updatedItems.push({
        CateringItemID,
        quantity,
        description,
        totalPrice: itemTotalPrice,
      });

      totalOrderPrice += itemTotalPrice;
    }

    // Check if the user already has an order
    let cateringUser = await CateringUser.findOne({ userId });

    if (cateringUser) {
      // Update existing catering order
      cateringUser.items = updatedItems;
      cateringUser.totalPrice = totalOrderPrice;
      await cateringUser.save();
      return res.status(200).json({ message: 'Catering order updated successfully!', data: cateringUser });
    } else {
      // Create a new catering order
      cateringUser = new CateringUser({
        userId,
        items: updatedItems,
        totalPrice: totalOrderPrice,
      });

      await cateringUser.save();
      return res.status(201).json({ message: 'Catering order saved successfully!', data: cateringUser });
    }

  } catch (error) {
    console.error('Error saving catering order:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
