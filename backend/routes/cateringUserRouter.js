import express from "express";
import { getCateringUser, addCateringItemToCateringUser, deleteCateringItemFromUser } from "../controllers/cateringUserController.js";

const router = express.Router();

router.get("/:userId", getCateringUser);
router.post("/", addCateringItemToCateringUser);
router.delete("/:userId/:cateringItemId", deleteCateringItemFromUser);

export default router;
