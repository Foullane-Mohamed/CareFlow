import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

export const registerUser = async (name, email, password, role) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already in use");

  const user = await User.create({ name, email, password, role });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid email or password");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
};
