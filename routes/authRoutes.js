import express from "express";
import {
  register,
  createUser,
  login,
  logout,
  getProfile,
  refreshToken,
  requestPasswordReset,
  resetPassword,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  checkPermission,
  checkPublicPermission,
} from "../middlewares/rbacMiddleware.js";

const router = express.Router();

router.post("/register", checkPublicPermission("REGISTER"), register);
router.post("/users", authenticate, checkPermission("CREATE_USER"), createUser);
router.post("/login", login);
router.post("/logout", authenticate, logout);
router.post("/refresh-token", refreshToken);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.get("/profile", authenticate, getProfile);

export default router;
