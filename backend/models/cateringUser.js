import { Schema, model } from "mongoose";

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

export default model("CateringUser", CateringUserSchema);
