import DesignUser from "../models/designUser.js";
import Design from "../models/design.js";

// Get a user's design items with price, category, and itemName from Design table
export const getDesignUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const designUser = await DesignUser.findOne({ userId })
      .populate({
        path: "items.designItemId",  // Populate the designItemId field
        select: "itemName category price" 
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
    let designUser = await DesignUser.findOne({ userId });

    if (!designUser) {
      designUser = new DesignUser({ userId, items });
    } else {
      for (const item of items) {
        const existingItem = designUser.items.find(
          (i) => i.designItemId.toString() === item.designItemId.toString()
        );

        const designItem = await Design.findById(item.designItemId);
        if (!designItem) {
          return res.status(404).json({ message: `Design item not found for ID: ${item.designItemId}` });
        }

        if (existingItem) {
          existingItem.quantity += item.quantity;
          existingItem.descriptionUser = item.descriptionUser;
          existingItem.totalPrice = existingItem.quantity * designItem.price;
        } else {
          designUser.items.push({
            designItemId: item.designItemId,
            quantity: item.quantity,
            price: designItem.price,
            totalPrice: item.quantity * designItem.price,
            descriptionUser: item.descriptionUser
          });
        }
      }

      designUser.grandTotal = designUser.items.reduce((total, item) => total + item.totalPrice, 0);
    }

    await designUser.save();
    res.status(200).json({ message: "Item added/updated successfully", designUser });

  } catch (error) {
    console.error("Error in addDesignItemToDesignUser:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete an item from the user's design order
export const deleteDesignItemFromUser = async (req, res) => {
  const { userId, designItemId } = req.params;
  try {
    const designUser = await DesignUser.findOne({ userId });
    if (!designUser) {
      return res.status(404).json({ message: "Design order not found" });
    }

    // Convert `designItemId` to ObjectId
    designUser.items = designUser.items.filter(
      (item) => item.designItemId.toString() !== designItemId.toString()
    );

    // Recalculate the grandTotal
    designUser.grandTotal = designUser.items.reduce(
      (acc, item) => acc + item.totalPrice, 0
    );

    await designUser.save();
    res.status(200).json({ message: "Item removed successfully", designUser });
  } catch (error) {
    console.error("Error in deleteDesignItemFromUser:", error);
    res.status(500).json({ message: error.message });
  }
};




// Update an existing item
export const updateDesignUserItem = async (req, res) => {
  const { userId, designItemId } = req.params;
  const { quantity, descriptionUser } = req.body;

  try {
    const designUser = await DesignUser.findOne({ userId });

    if (!designUser) {
      return res.status(404).json({ message: "Design order not found" });
    }

    // Find the item in the array
    const itemIndex = designUser.items.findIndex(
      (item) => item.designItemId.toString() === designItemId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Fetch price from Design table
    const designItem = await Design.findById(designItemId);
    if (!designItem) {
      return res.status(404).json({ message: "Design item not found" });
    }

    const itemPrice = designItem.price;

    // Update item
    designUser.items[itemIndex].quantity = quantity;
    designUser.items[itemIndex].descriptionUser = descriptionUser;
    designUser.items[itemIndex].totalPrice = quantity * itemPrice;

    // Recalculate grandTotal
    designUser.grandTotal = designUser.items.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    await designUser.save();

    res.json({ message: "Item updated successfully", designUser });
  } catch (error) {
    console.error("Error in updateDesignUserItem:", error);
    res.status(500).json({ message: error.message });
  }
};
