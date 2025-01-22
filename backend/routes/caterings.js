import express from "express";
import { getOrCreateCatering, updateCatering } from "../controllers/catering.js";

const router = express.Router();

// Get or Create Catering
router.get("/", getOrCreateCatering);

// Update Catering
router.post("/", updateCatering);

export default router;
