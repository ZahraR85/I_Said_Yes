import express from "express";
import {
  getCateringSelection,
  saveCateringSelection,
  deleteCateringSelection,
} from "../controllers/cateringSelectionController.js";

const router = express.Router();

// Get catering selection for a user
router.get("/:userId", getCateringSelection);

// Save or update catering selection for a user
router.put("/:userId", saveCateringSelection);

// Delete catering selection for a user (optional)
router.delete("/:userId", deleteCateringSelection);

export default router;
