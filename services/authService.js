import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // 15 minutes
  );
};

const generateRefreshToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "7d" } // 7 days
  );
};

const registerUser = async (name, email, password, role = "patient") => {
  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already in use");

  const user = await User.create({ name, email, password, role });

  // Generate both tokens
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  // Store refresh token in database
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

export {
  registerUser,
  createUserByAdmin,
  loginUser,
  logoutUser,
  getUserProfile,
  refreshAccessToken,
  generateAccessToken,
  generateRefreshToken,
};
