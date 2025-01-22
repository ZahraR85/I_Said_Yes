import { Schema, model } from "mongoose";

const SelectionSchema = new Schema({
  cateringID: {
    type: Schema.Types.ObjectId, // Reference to MusicOption collection
    ref: "Catering",
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  VariantDescription: {
    type: String,
    required: true,
  },
});

const CustomRequestSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: false,
  },
});

const cateringSelectionSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId, // Reference to User model
      ref: "User",
      required: true,
      // trim: true,
    },
    selections: [SelectionSchema], // Array of selected options
    customRequests: [CustomRequestSchema], // Array of custom requests
    totalCost: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default model("CateringSelection", cateringSelectionSchema);