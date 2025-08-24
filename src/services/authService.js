const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const register = async (userData) => {
  const { email, password, fullName } = userData;
  if (!email || !password || !fullName) throw new Error('Missing fields');
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error('User exists');
  const user = await User.create({ email, passwordHash: password, fullName });
  return { user: { id: user.userId, email, fullName }, token: generateToken(user.userId) };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.validPassword(password))) throw new Error('Invalid credentials');
  return {
    user: {
      id: user.userId,
      email: user.email,
      fullName: user.fullName,
      profilePictureUrl: user.profilePictureUrl || ''
    },
    token: generateToken(user.userId)
  };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('User not found');
  const token = crypto.randomBytes(20).toString('hex');
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  const mailOptions = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: 'Reset Password',
    text: `Reset your password: http://localhost:3000/reset/${token}`
  };
  await transporter.sendMail(mailOptions);
};

const resetPassword = async (token, newPassword) => {
  const user = await User.findOne({ where: { resetToken: token, resetTokenExpiry: { $gt: Date.now() } } });
  if (!user) throw new Error('Invalid token');
  user.passwordHash = newPassword;
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();
};

const updateProfile = async (userId, data) => {
  console.log('Updating profile for userId:', userId); // Log userId
  console.log('Profile data:', data); // Log data
  if (!userId) throw new Error('User ID is required');
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');
  await user.update({
    fullName: data.fullName,
    email: data.email,
    profilePictureUrl: data.profilePictureUrl,
  });
  return {
    userId: user.userId,
    email: user.email,
    fullName: user.fullName,
    profilePictureUrl: user.profilePictureUrl,
  };
};


const getProfile = async (userId) => {
  console.log('Fetching profile for userId:', userId);
  const user = await User.findByPk(userId);
  if (!user) {
    console.error('User not found for userId:', userId);
    throw new Error('User not found');
  }
  console.log('User found:', {
    userId: user.userId,
    email: user.email,
    fullName: user.fullName,
    profilePictureUrl: user.profilePictureUrl
  });
  return {
    userId: user.userId,
    email: user.email,
    fullName: user.fullName,
    profilePictureUrl: user.profilePictureUrl || ''
  };
};

module.exports = { register, login, forgotPassword, resetPassword, updateProfile, getProfile };