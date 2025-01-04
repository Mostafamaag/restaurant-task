import express from "express";
import {
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory
} from "../controllers/categoryController.js";
import verifyToken from "../middleware/verifyToken.js";
import allowedTo from "../middleware/allowedTo.js";

const router = express.Router();

//router.use(verifyToken);

router.post("/", verifyToken, allowedTo("RESTAURANT", "CAFE"), addCategory);
router.get("/", getCategories);
router.put("/:id", verifyToken, allowedTo("RESTAURANT", "CAFE"), updateCategory);
router.delete("/:id", verifyToken, allowedTo("RESTAURANT", "CAFE"), deleteCategory);

export default router;
