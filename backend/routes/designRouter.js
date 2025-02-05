import express from "express";
import {
  getDesigns,
  getDesignById,
  createDesign,
  updateDesign,
  deleteDesign,
} from "../controllers/designController.js";
import { verifyToken, adminOnly } from "../middleware/auth.js";
import fileUploader from "../middleware/multer.js";
import cloudUploader from "../middleware/cloudinaryUploadMiddleware.js";

const router = express.Router();

// Route to get all designs
router.get("/", getDesigns);

// Route to get a design by ID
router.get("/:id", getDesignById);

// Route to create a new design
router.post("/", verifyToken, adminOnly, fileUploader.single("image"), cloudUploader, createDesign);

// Route to update an existing design
router.put("/:id", verifyToken, adminOnly, fileUploader.single("image"), cloudUploader, updateDesign);

// Route to delete a design
router.delete("/:id", verifyToken, adminOnly, deleteDesign);

export default router;
