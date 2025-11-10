import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const generateAccessToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const registerUser = async (name, email, password, role = "patient") => {
  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already in use");

  const user = await User.create({ name, email, password, role });

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

const createUserByAdmin = async (name, email, password, role, adminRole) => {
  if (adminRole !== "admin") {
    throw new Error("Only administrators can create users with specific roles");
  }

  if (!name || !email || !password || !role) {
    throw new Error("Name, email, password, and role are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already in use");

  const user = await User.create({ name, email, password, role });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
};

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid email or password");

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
  return { message: "Logout successful" };
};

const getUserProfile = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.refreshToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = generateAccessToken(user._id, user.role);

    return {
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid refresh token");
    }
    if (error.name === "TokenExpiredError") {
      throw new Error("Refresh token expired. Please login again");
    }
    throw error;
  }
};

const requestPasswordReset = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error(
      "If an account with that email exists, a password reset token would be generated"
    );
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();


  const resetUrl = `${
    process.env.FRONTEND_URL || "http://localhost:3000"
  }/reset-password?token=${resetToken}`;

  return {
    message: "Password reset token generated successfully",
    resetToken: resetToken,
    resetUrl: resetUrl,
    expiresIn: "1 hour",
  };
};

const resetPassword = async (token, newPassword) => {
  if (!token || !newPassword) {
    throw new Error("Token and new password are required");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  user.password = newPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  user.refreshToken = null;
  await user.save();

  return {
    message:
      "Password has been reset successfully. Please login with your new password",
  };
};

export {
  registerUser,
  createUserByAdmin,
  loginUser,
  logoutUser,
  getUserProfile,
  refreshAccessToken,
  generateAccessToken,
  generateRefreshToken,
  requestPasswordReset,
  resetPassword,
};
