import express from "express";
import { getDesignUser, addDesignItemToDesignUser, deleteDesignItemFromUser, updateDesignUserItem } from "../controllers/designUserController.js";

const router = express.Router();

router.get("/:userId", getDesignUser);
router.post("/", addDesignItemToDesignUser);
router.delete("/:userId/:designItemId", deleteDesignItemFromUser);

router.put("/:userId/:designItemId", updateDesignUserItem);

export default router;
