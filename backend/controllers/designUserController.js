import DesignUser from "../models/designUser.js";
import Design from "../models/design.js";

// Get a user's design items with price, category, and itemName from Design table
export const getDesignUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const designUser = await DesignUser.findOne({ userId })
      .populate({
        path: "items.designItemId",  // Populate the designItemId field
        select: "itemName design price"  
      });

    if (!designUser) {
      return res.status(404).json({ message: "Design order not found for this user" });
    }

    // Send the populated user design data with detailed items
    res.status(200).json(designUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Add or update design items in designUser
export const addDesignItemToDesignUser = async (req, res) => {
  const { userId, items } = req.body; 

  try {
    // Find the Designing order for the user
    let designUser = await DesignUser.findOne({ userId });

    if (!designUser) {
      // If no order exists for the user, create a new order with the items
      designUser = new DesignUser({
        userId,
        items,
        grandTotal: items.reduce((total, item) => total + item.price * item.quantity, 0), // Calculate grandTotal
      });
    } else {
      // Update existing items or add new items to the existing order
      items.forEach(item => {
        const existingItem = designUser.items.find(
          (existingItem) => existingItem.designItemId.toString() === item.designItemId.toString()
        );

        if (existingItem) {
          // If the item exists, update its quantity and description
          existingItem.quantity += item.quantity;
          existingItem.description = item.description;
        } else {
          // If the item doesn't exist, add it to the items array
          designUser.items.push(item);
        }
      });

      // Recalculate the grandTotal
      designUser.grandTotal = designUser.items.reduce(
        (total, item) => total + item.price * item.quantity, 0
      );
    }

    // Save the updated Designing user order
    await designUser.save();

    // Return success message and updated order
    res.status(200).json({ message: "Item added/updated successfully", designUser });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
};



// Delete an item from the user's design order
export const deleteDesignItemFromUser = async (req, res) => {
  const { userId, designItemId } = req.params;

  try {
    const designUser = await DesignUser.findOne({ userId });
    if (!designUser) {
      return res.status(404).json({ message: "Designing order not found" });
    }

    designUser.items = designUser.items.filter(
      (item) => item.designItemId.toString() !== designItemId
    );

    // Recalculate the grandTotal after deletion
    designUser.grandTotal = designUser.items.reduce(
      (acc, item) => acc + item.totalPrice, 0
    );

    await designUser.save();
    res.status(200).json({ message: "Item removed successfully", designUser });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



// Update an existing item
export const updateDesignUserItem = async (req, res) => {
  const { userId, designItemId } = req.params;
  const { quantity, description } = req.body;

  try {
    const designUser = await DesignUser.findOne({ userId });

    if (!designUser) {
      return res.status(404).json({ message: "Design order not found" });
    }

    // Find the item within the user's Design items
    const itemIndex = designUser.items.findIndex(
      (item) => item.designItemId.toString() === designItemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Fetch the price from the Design table
    const designItem = await Design.findById(designItemId);
    if (!designItem || !designItem.price) {
      return res.status(404).json({ message: "Design item not found or price missing" });
    }

    const itemPrice = designItem.price; // Ensure we have a valid price

    // Update quantity and description
    designUser.items[itemIndex].quantity = quantity;
    designUser.items[itemIndex].description = description;
    designUser.items[itemIndex].totalPrice = quantity * itemPrice;

    // Recalculate the grandTotal
    designUser.grandTotal = designUser.items.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    await designUser.save();

    res.json({ message: "Item updated successfully", designUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};