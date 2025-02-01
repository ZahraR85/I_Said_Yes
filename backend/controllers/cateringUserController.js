import CateringUser from "../models/cateringUser.js";
import Catering from "../models/catering.js";

// Get a user's catering items with price, category, and ItemName from Catering table
export const getCateringUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the catering user and populate the cateringItemId field with data from the Catering table
    const cateringUser = await CateringUser.findOne({ userId })
      .populate({
        path: "items.cateringItemId",  // Populate the cateringItemId field
        select: "ItemName category price"  // Only select these fields from the Catering table
      });

    if (!cateringUser) {
      return res.status(404).json({ message: "Catering order not found for this user" });
    }

    // Send the populated user catering data with detailed items
    res.status(200).json(cateringUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Add or update catering items in CateringUser
export const addCateringItemToCateringUser = async (req, res) => {
  const { userId, items } = req.body; // items is an array of catering items

  try {
    // Find the catering order for the user
    let cateringUser = await CateringUser.findOne({ userId });

    if (!cateringUser) {
      // If no order exists for the user, create a new order with the items
      cateringUser = new CateringUser({
        userId,
        items,
        grandTotal: items.reduce((total, item) => total + item.price * item.quantity, 0), // Calculate grandTotal
      });
    } else {
      // Update existing items or add new items to the existing order
      items.forEach(item => {
        const existingItem = cateringUser.items.find(
          (existingItem) => existingItem.cateringItemId.toString() === item.cateringItemId.toString()
        );

        if (existingItem) {
          // If the item exists, update its quantity and description
          existingItem.quantity += item.quantity;
          existingItem.description = item.description;
        } else {
          // If the item doesn't exist, add it to the items array
          cateringUser.items.push(item);
        }
      });

      // Recalculate the grandTotal
      cateringUser.grandTotal = cateringUser.items.reduce(
        (total, item) => total + item.price * item.quantity, 0
      );
    }

    // Save the updated catering user order
    await cateringUser.save();

    // Return success message and updated order
    res.status(200).json({ message: "Item added/updated successfully", cateringUser });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
};



// Delete an item from the user's catering order
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

    // Recalculate the grandTotal after deletion
    cateringUser.grandTotal = cateringUser.items.reduce(
      (acc, item) => acc + item.totalPrice, 0
    );

    await cateringUser.save();
    res.status(200).json({ message: "Item removed successfully", cateringUser });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



// Update an existing item
export const updateCateringUserItem = async (req, res) => {
  const { userId, itemId } = req.params;
  const { quantity, description } = req.body;

  try {
    const cateringUser = await CateringUser.findOne({ userId });
    if (!cateringUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const itemIndex = cateringUser.items.findIndex(
      (item) => item.cateringItemId.toString() === itemId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Update item
    cateringUser.items[itemIndex].quantity = quantity;
    cateringUser.items[itemIndex].description = description;

    // Recalculate the total price for the updated item
    cateringUser.items[itemIndex].totalPrice = quantity * cateringUser.items[itemIndex].price;

    // Recalculate the grandTotal
    cateringUser.grandTotal = cateringUser.items.reduce(
      (acc, item) => acc + item.totalPrice, 0
    );

    await cateringUser.save();
    res.status(200).json(cateringUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
