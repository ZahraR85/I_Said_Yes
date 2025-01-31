import { Schema, model } from "mongoose";

const CateringUserSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true,
  },
  items: [{
    CateringItemID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CateringItem',  // Reference to the CateringItem model
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
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
}, { timestamps: true });

export default model("CateringUser", CateringUserSchema);
