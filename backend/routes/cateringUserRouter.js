import express from "express";
import {
  getCateringUser,
  addCateringItemToCateringUser,
  updateCateringItemInCateringUser,
} from "../controllers/cateringUserController.js";

const router = express.Router();

// Get catering user order
router.get("/:userId", getCateringUser);

// Add catering item to cateringUser order
router.post("/", addCateringItemToCateringUser);

// Update catering item in cateringUser order
router.put("/update", updateCateringItemInCateringUser);

export default router;
