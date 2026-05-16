const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Streak = require('../models/Streak');
const { setTokenCookies, generateAccessToken } = require('../utils/generateToken');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const user = await User.create({ name, email, password });
  await Streak.create({ user: user._id });

  const tokens = setTokenCookies(res, user._id);

  res.status(201).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      xp: user.xp,
      level: user.level,
      settings: user.settings,
    },
    accessToken: tokens.accessToken,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const tokens = setTokenCookies(res, user._id);

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      xp: user.xp,
      level: user.level,
      totalSessions: user.totalSessions,
      totalFocusMinutes: user.totalFocusMinutes,
      settings: user.settings,
    },
    accessToken: tokens.accessToken,
  });
};

const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json({ success: false, message: 'No refresh token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken(decoded.id);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000,
    });
    res.json({ success: true, accessToken });
  } catch {
    res.status(401).json({ success: false, message: 'Refresh token invalid' });
  }
};

const logout = async (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out' });
};

const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

const updateProfile = async (req, res) => {
  const { name, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { ...(name && { name }), ...(avatar !== undefined && { avatar }) },
    { new: true, runValidators: true }
  );
  res.json({ success: true, user });
};

const updateSettings = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.settings = { ...user.settings.toObject(), ...req.body };
  await user.save();
  res.json({ success: true, settings: user.settings });
};

const saveReflection = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { dailyReflection: req.body.reflection, lastReflectionDate: new Date() },
    { new: true }
  );
  res.json({ success: true, reflection: user.dailyReflection });
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  updateSettings,
  saveReflection,
};
