import express from "express";
import { getCateringUser, addCateringItemToCateringUser, deleteCateringItemFromUser, updateCateringUserItem } from "../controllers/cateringUserController.js";

const router = express.Router();

router.get("/:userId", getCateringUser);
router.post("/", addCateringItemToCateringUser);
router.delete("/:userId/:cateringItemId", deleteCateringItemFromUser);

router.put("/:userId/:cateringItemId", updateCateringUserItem);

export default router;
