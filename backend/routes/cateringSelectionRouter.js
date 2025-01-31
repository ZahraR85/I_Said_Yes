import express from "express";
import {
  getCateringSelection,
  saveCateringSelection,
  deleteCateringItem,
} from "../controllers/cateringSelectionController.js";

const router = express.Router();

// Get catering selection for a user
router.get("/:userId", getCateringSelection);

// Save or update catering selection for a user
router.put("/:userId", saveCateringSelection);

// Delete catering selection for a user (optional)
router.delete("/:userId/:cateringItemId", deleteCateringItem);

export default router;
