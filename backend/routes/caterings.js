import express from "express";
import {
  createOrUpdateCatering,
  getCatering,
  getCateringById,
  deleteCatering,
} from "../controllers/CateringController.js";

const router = express.Router();

// Route to create or update a reception (using POST for both)
router.post("/", createOrUpdateCatering);

// Route to get all receptions for a user
router.get("/", getCatering);

// Route to get a specific reception by ID
router.get("/:id", getCateringById);

// Route to delete a reception by ID
router.delete("/:id", deleteCatering);

export default router;
