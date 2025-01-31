import { Schema, model } from "mongoose";

// CateringUser Schema definition
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
    },
  }],
  grandTotal: { 
    type: Number, 
    required: true, 
    default: 0 
  },
}, { timestamps: true });

// Pre-save hook to calculate grandTotal
CateringUserSchema.pre('save', function(next) {
  // Calculate total price for all items
  const totalPrice = this.items.reduce((acc, item) => acc + (item.totalPrice * item.quantity), 0);
  
  // Set grandTotal based on calculated total price
  this.grandTotal = isNaN(totalPrice) ? 0 : totalPrice;

  next(); // Continue with the save process
});

// Export the model
export default model("CateringUser", CateringUserSchema);
