import express from "express";
import {register,createUser,login,logout,getProfile,} from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { checkPermission } from "../middlewares/rbacMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/users", authenticate, checkPermission("CREATE_USER"), createUser);
router.post("/login", login);
router.post("/logout", authenticate, logout);
router.get("/profile", authenticate, getProfile);

export default router;
