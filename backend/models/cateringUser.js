import mongoose, { Schema, model } from "mongoose";
import Catering from "./catering.js"; // Import Catering model

const CateringUserSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    cateringItemId: {
      type: Schema.Types.ObjectId,
      ref: 'Catering',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    description: {
      type: String,
      default: '',
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0, // Ensure it's never undefined
    },
  }],
  grandTotal: { 
    type: Number, 
    required: true, 
    default: 0,
  },
}, { timestamps: true });

// Pre-validation middleware to calculate totalPrice and grandTotal
CateringUserSchema.pre('validate', async function(next) {
  try {
    if (!this.items || !Array.isArray(this.items) || this.items.length === 0) {
      this.grandTotal = 0;
      return next();
    }

    let total = 0;

    // Process each item and fetch price
    for (const item of this.items) {
      if (!mongoose.Types.ObjectId.isValid(item.cateringItemId)) {
        return next(new Error(`Invalid cateringItemId: ${item.cateringItemId}`));
      }

      const cateringItem = await Catering.findById(item.cateringItemId);
      if (!cateringItem) {
        return next(new Error(`Catering item not found for ID: ${item.cateringItemId}`));
      }

      const price = cateringItem.price || 0;
      item.totalPrice = price * (item.quantity || 1);
      total += item.totalPrice;
    }

    this.grandTotal = total > 0 ? total : 0;

    next();
  } catch (error) {
    next(error);
  }
});

export default model("CateringUser", CateringUserSchema);
