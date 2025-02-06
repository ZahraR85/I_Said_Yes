import ShoppingCard from '../models/shoppingCard.js';
//import Catering from "../models/reception.js";
import Music from "../models/music.js";
import Photography from "../models/photography.js";
import Makeup from "../models/makeup.js";
import Venue from '../models/venueSelection.js';
import Catering from '../models/cateringUser.js';
import Design from '../models/designUser.js'

// Add or update service in the shopping card
export const createOrUpdateShoppingCard = async (req, res) => {
  try {
    const { userID, serviceName, price } = req.body;

    // Validate required fields
    if (!userID || !serviceName || typeof price !== 'number') {
      return res.status(400).json({ message: "User ID, Service Name, and Price are required." });
    }

    // Check if an entry already exists for the user and service
    const existingCardEntry = await ShoppingCard.findOne({ userID, serviceName });

    if (existingCardEntry) {
      // Update the existing entry
      existingCardEntry.price = price;

      await existingCardEntry.save();

      return res.status(200).json({
        message: "Shopping card entry updated successfully.",
        cart: existingCardEntry,
      });
    }

    // Create a new entry if none exists
    const newCartEntry = await ShoppingCard.create({
      userID,
      serviceName,
      price,
    });

    return res.status(201).json({
      message: "Shopping card entry created successfully.",
      cart: newCartEntry,
    });
  } catch (error) {
    console.error("Error in createOrUpdateShoppingCard:", error.message);
    return res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

// Get user's shopping card
export const getShoppingCard = async (req, res) => {
  const { userID } = req.query;

  try {
    if (!userID) {
      return res.status(400).json({ message: 'UserID is required.' });
    }

    const cardItems = await ShoppingCard.find({ userID });

    if (!cardItems.length) {
      return res.status(200).json({ cardItems: [], totalPrice: 0 }); // Return empty response
    }

    const totalPrice = cardItems.reduce((sum, item) => sum + item.price, 0);

    res.status(200).json({ cardItems, totalPrice });
  } catch (error) {
    console.error("Error in getShoppingCard:", error.message);
    res.status(500).json({ message: 'Error fetching shopping card', error: error.message });
  }
};

export const removeFromShoppingCard = async (req, res) => {
  const { userID, serviceName } = req.body;

  try {
    if (!userID || !serviceName) {
      return res.status(400).json({ message: 'UserID and ServiceName are required.' });
    }

    // Step 1: Remove from ShoppingCard
    const deletedItem = await ShoppingCard.findOneAndDelete({ userID, serviceName });

    if (!deletedItem) {
      return res.status(404).json({ message: 'Service not found in the shopping card.' });
    }

    // Step 2: Remove from specific model based on serviceName
    let model;
    let query;

    switch (serviceName) {
      case 'Makeup':
        model = Makeup;
        query = { userID }; // Query matches userID for these models
        break;
      case 'Music':
        model = Music;
        query = { userID };
        break;
      case 'Photography':
        model = Photography;
        query = { userID };
        break;
      case 'Venue':
        model = Venue;
        query = { userId: userID }; // Handle lowercase userId specifically for Venue
        break;
      case 'Catering':
        model = Catering;
        query = { userId: userID };  // Handle lowercase userId specifically for Venue
        break;
      case 'Designing':
        model = Design;
        query = { userId: userID };  // Handle lowercase userId specifically for Venue
        break;
      default:
        return res.status(400).json({ message: 'Invalid serviceName provided.' });
    }

    // Attempt to delete from the specific model
    const specificDeleted = await model.findOneAndDelete(query);
    if (!specificDeleted) {
      console.warn(`No matching record found in ${serviceName} model for query:`, query);
    }

    // Step 3: Fetch updated shopping card to calculate total price
    const cardItems = await ShoppingCard.find({ userID });
    const totalPrice = cardItems.reduce((sum, item) => sum + item.price, 0);

    return res.status(200).json({
      message: `Service '${serviceName}' removed successfully.`,
      cardItems,
      totalPrice,
    });
  } catch (error) {
    console.error('Error in removeFromShoppingCard:', error.message);
    return res.status(500).json({ message: 'Failed to remove service.', error: error.message });
  }
};






// Clear the shopping card
export const clearShoppingCard = async (req, res) => {
  const { userID } = req.params;

  try {
    if (!userID) {
      return res.status(400).json({ message: 'UserID is required.' });
    }

    await ShoppingCard.deleteMany({ userID });

    res.status(200).json({ message: 'Shopping card cleared successfully.' });
  } catch (error) {
    console.error("Error in clearShoppingCard:", error.message);
    res.status(500).json({ message: 'Failed to clear shopping card.', error: error.message });
  }
};







export const removeAllFromShoppingCard = async (req, res) => {
  const { userID } = req.body; // Assuming the userID comes from the body

  try {
    if (!userID) {
      return res.status(400).json({ message: 'UserID is required.' });
    }

    // Step 1: Remove all services from the ShoppingCart
    await ShoppingCard.deleteMany({ userID });

    // Step 2: Remove services from related models (Makeup, Music, Catering, Photography, Venue)
    const models = [
      { model: Makeup, query: { userID } },
      { model: Music, query: { userID } },
      { model: Catering, query: { userID } },
      { model: Design, query: { userID } },
      { model: Photography, query: { userID } },
      { model: Venue, query: { userId: userID } } // Handle userId for Venue model
    ];

    // Delete from each model
    for (const { model, query } of models) {
      await model.deleteMany(query);
    }

    // After deletion, you can return a success message or updated data if needed
    return res.status(200).json({ message: 'All services removed from shopping cart and associated tables.' });
  } catch (error) {
    console.error('Failed to remove services:', error.message);
    return res.status(500).json({ message: 'Failed to remove all services from the shopping cart and tables.', error: error.message });
  }
};
