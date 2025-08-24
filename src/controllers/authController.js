const authService = require('../services/authService');

const registerUser = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.json({ message: 'Reset link sent' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(req.params.token, req.body.password);
    res.json({ message: 'Password reset' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    console.log('req.user:', req.user); // Log req.user
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }
    const updatedUser = await authService.updateProfile(req.user.userId, req.body);
    res.json(updatedUser);
  } catch (err) {
    console.error('Update profile error:', err.message); // Log lỗi
    res.status(400).json({ message: err.message });
  }
};


const getProfile = async (req, res) => {
  try {
    console.log('req.user:', req.user);
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }
    const user = await authService.getProfile(req.user.userId);
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword, updateProfile, getProfile
 };