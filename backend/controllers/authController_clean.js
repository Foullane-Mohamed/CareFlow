import {
  registerUser,
  createUserByAdmin,
  loginUser,
  logoutUser,
  getUserProfile,
  refreshAccessToken,
  requestPasswordReset as requestPasswordResetService,
  resetPassword as resetPasswordService,
,  getAllDoctors as getAllDoctorsService} from "../services/authService.js";
import {
  requestResetValidation,
  resetPasswordValidation,
} from "../validators/authValidator.js";

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const { user, accessToken, refreshToken } = await registerUser(
      name,
      email,
      password,
      role
    );

    res.status(201).json({
      message: "User registered successfully",
      user,
      accessToken,
      refreshToken,
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
    const { user, accessToken, refreshToken } = await loginUser(
      email,
      password
    );

    res.status(200).json({
      message: "Login successful",
      user,
      accessToken,
      refreshToken,
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

const refreshToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const refreshToken = authHeader.split(" ")[1];

    const { accessToken, user } = await refreshAccessToken(refreshToken);

    res.status(200).json({
      message: "Access token refreshed successfully",
      accessToken,
      user,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { error } = requestResetValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email } = req.body;
    const result = await requestPasswordResetService(email);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { error } = resetPasswordValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { token, newPassword } = req.body;
    const result = await resetPasswordService(token, newPassword);

    res.status(200).json({
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



const getDoctors = async (req, res) => {
  try {
    const doctors = await getAllDoctorsService();
    res.status(200).json({
      message: "Doctors fetched successfully",
      data: doctors
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export {
  register,
  createUser,
  login,
  logout,
  getProfile,
  refreshToken,
  requestPasswordReset,
  resetPassword,
,  getDoctors};

