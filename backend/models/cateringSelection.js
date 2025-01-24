import { Schema, model } from "mongoose";

// Define the catering selection schema
const cateringSelectionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
    selectedItems: [
      {
        category: {
          type: String,
          enum: [
            "Starter",
            "MainCourse",
            "Dessert",
            "ColdDrink",
            "CafeBar",
            "Fruits",
            "Cake",
            "Waiter",
          ],
          required: true,
        },
        items: [
          {
            cateringItemId: { type: Schema.Types.ObjectId, ref: "Catering", required: true },
            itemName: { type: String, required: true },
            quantity: { type: Number, required: true, default: 1 },
            price: { type: Number, required: true },
            description: { type: String, required: true },
          },
        ],
        categoryTotalPrice: { type: Number, required: true, default: 0 },
      },
    ],
    grandTotal: { type: Number, required: true, default: 0 }, // Total of all categories' totals
  },
  { timestamps: true }
);

// Export the model with the correct name
export default model("CateringSelection", cateringSelectionSchema);
