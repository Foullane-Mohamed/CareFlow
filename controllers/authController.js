import {
  registerUser,
  createUserByAdmin,
  loginUser,
  logoutUser,
  getUserProfile,
} from "../services/authService.js";

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const { user, token } = await registerUser(name, email, password, role);

    res.status(201).json({
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!role) {
      return res
        .status(400)
        .json({ message: "Role is required for admin user creation" });
    }

    const user = await createUserByAdmin(
      name,
      email,
      password,
      role,
      req.user.role
    );

    res.status(201).json({
      message: "User created successfully by administrator",
      user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const userProfile = getUserProfile(req.user);
    res.status(200).json({ user: userProfile });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    await logoutUser(req.user._id);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { register, createUser, login, logout, getProfile };
