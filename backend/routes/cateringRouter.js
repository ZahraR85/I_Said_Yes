import express from "express";
import {
  addCateringItem,
  getCateringItems,
  updateCateringItem,
  deleteCateringItem,
} from "../controllers/cateringController.js";

const router = express.Router();

// Add a new catering item
router.post("/", addCateringItem);

// Get all catering items
router.get("/", getCateringItems);

// Update a catering item
router.put("/:id", updateCateringItem);

// Delete a catering item
router.delete("/:id", deleteCateringItem);

export default router;
