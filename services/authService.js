import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

const registerUser = async (name, email, password, role = "patient") => {
  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already in use");

  const user = await User.create({ name, email, password, role });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
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

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const logoutUser = async (userId) => {
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

export {
  registerUser,
  createUserByAdmin,
  loginUser,
  logoutUser,
  getUserProfile,
};
