import express from "express";
import {
  getCateringItems,
  addCateringItem,
  deleteCateringItem,
  updateCateringItem,
  getCateringByCategory,
  getCateringItemById,
  getCateringCategories,
} from "../controllers/cateringController.js";
import { verifyToken, adminOnly } from "../middleware/auth.js";
import fileUploader from "../middleware/multer.js";
import cloudUploader from "../middleware/cloudinaryUploadMiddleware.js";

const router = express.Router();

// Get all catering items
router.get("/", getCateringItems);

// Get a single catering item by ID
router.get("/:id", getCateringItemById);

// Add a new catering item
router.post("/", verifyToken, adminOnly, fileUploader.single("image"), cloudUploader, addCateringItem);

// Delete a catering item
router.delete("/:id", verifyToken, adminOnly, deleteCateringItem);

// Update a catering item
router.put("/:id", verifyToken, adminOnly, fileUploader.single("image"), cloudUploader, updateCateringItem);

// Get catering items by category
router.get("/category/:category", getCateringByCategory);

// Get all unique catering categories
router.get("/categories", getCateringCategories);

export default router;
