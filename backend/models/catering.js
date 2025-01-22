import { Schema, model } from "mongoose";

const cateringSchema = new Schema(
  {
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
    VariantDescription: {
      type: String,
      required: false,
    },
    additionalFeatures: [String], // Optional array of features
    sampleLink: {
      type: String, // URL to a sample performance
      required: false,
    },
  },
  { timestamps: true }
);

export default model("Catering", cateringSchema);