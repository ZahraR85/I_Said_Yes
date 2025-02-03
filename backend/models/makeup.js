import { Schema, model } from "mongoose";

const makeupSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId, // Reference to the User schema
      ref: "User",
      required: true,
    },
    makeup: {
      type: String,
      enum: ["Budget Makeup", "Luxury Makeup", "VIP Makeup"],
      default: "Budget Makeup",
    },
    hairstyle: {
      type: String,
      enum: [
        "Simple Shenyun",
        "Complex Shenyun",
        "Babylis",
        "Extra Hair Extension",
      ],
      default: "Simple Shenyun",
    },
    dyeHair: {
      type: String,
      enum: [
        "Highlights - Short Hair",
        "Highlights - Medium Hair",
        "Highlights - Long Hair",
        "Highlights - Very Long Hair",
        "Balayage - Short Hair",
        "Balayage - Medium Hair",
        "Balayage - Long Hair",
        "Balayage - Very Long Hair",
        "Full Hair Color - Short Hair",
        "Full Hair Color - Medium Hair",
        "Full Hair Color - Long Hair",
        "Full Hair Color - Very Long Hair",
      ],
      default: "Full Hair Color - Short Hair",
    },
    nail: {
      selected: { type: Boolean, default: false },
      price: { type: Number, default: 70 },
    },
    eyelashExtensions: {
      selected: { type: Boolean, default: false },
      price: { type: Number, default: 100 },
    },
    special: {
      selected: { type: Boolean, default: false },
      price: { type: Number, default: 300 },
    },
    total: {
      type: Number, // Automatically calculated
      default: 0,
    },
  },
  { timestamps: true }
);

makeupSchema.pre("save", function (next) {
  const makeupPrices = {
    "Budget Makeup": 150,
    "Luxury Makeup": 300,
    "VIP Makeup": 500,
  };

  const hairstylePrices = {
    "Simple Shenyun": 100,
    "Complex Shenyun": 150,
    "Babylis": 100,
    "Extra Hair Extension": 150,
  };

  const dyeHairPrices = {
    "Highlights - Short Hair": 80,
    "Highlights - Medium Hair": 120,
    "Highlights - Long Hair": 170,
    "Highlights - Very Long Hair": 170,
    "Balayage - Short Hair": 100,
    "Balayage - Medium Hair": 200,
    "Balayage - Long Hair": 300,
    "Balayage - Very Long Hair": 400,
    "Full Hair Color - Short Hair": 50,
    "Full Hair Color - Medium Hair": 80,
    "Full Hair Color - Long Hair": 120,
    "Full Hair Color - Very Long Hair": 150,
  };

  const makeupPrice = makeupPrices[this.makeup] || 0;
  const hairstylePrice = hairstylePrices[this.hairstyle] || 0;
  const dyeHairPrice = dyeHairPrices[this.dyeHair] || 0;

  this.total =
    makeupPrice +
    hairstylePrice +
    dyeHairPrice +
    (this.nail.selected ? this.nail.price : 0) +
    (this.eyelashExtensions.selected ? this.eyelashExtensions.price : 0) +
    (this.special.selected ? this.special.price : 0);

  next();
});

export default model("Makeup", makeupSchema);
