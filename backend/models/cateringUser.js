import { Schema, model } from "mongoose";

const SelectionCateringSchema = new Schema({
  CateringItemID: {
    type: Schema.Types.ObjectId, // Reference to MusicOption collection
    ref: "Catering",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
const cateringUserSchema = new Schema(
  { 
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      enum: ['Starter', 'MainCourse', 'Dessert', 'ColdDrink', 'CafeBar', 'Fruits', 'Cake', 'Waiter'],
      required: true,
    },
    ItemName: {
      type: String, // E.g., "name of food"
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
      default: 0,
    },
    selections: [SelectionCateringSchema], // Array of selected options
  },
  { timestamps: true }
);

export default model("CateringUser", cateringUserSchema);