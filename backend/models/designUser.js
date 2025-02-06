import mongoose, { Schema, model } from "mongoose";
import Design from "./design.js"; // Import Design model

const DesignUserSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    designItemId: {
      type: Schema.Types.ObjectId,
      ref: 'Design',
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
    descriptionUser: {
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
DesignUserSchema.pre('validate', async function(next) {
  try {
    if (!this.items || !Array.isArray(this.items) || this.items.length === 0) {
      this.grandTotal = 0;
      return next();
    }

    let total = 0;

    // Process each item and fetch price
    for (const item of this.items) {
      if (!mongoose.Types.ObjectId.isValid(item.designItemId)) {
        return next(new Error(`Invalid designItemId: ${item.designItemId}`));
      }

      const designItem = await Design.findById(item.designItemId);
      if (!cateringItem) {
        return next(new Error(`Design item not found for ID: ${item.designItemId}`));
      }

      const price = designItem.price || 0;
      item.totalPrice = price * (item.quantity || 1);
      total += item.totalPrice;
    }

    this.grandTotal = total > 0 ? total : 0;

    next();
  } catch (error) {
    next(error);
  }
});

export default model("DesignUser", DesignUserSchema);
