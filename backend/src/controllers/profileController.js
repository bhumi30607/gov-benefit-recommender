import User from "../models/User.js";
import SearchHistory from "../models/SearchHistory.js";

const buildProfilePictureUrl = (req, file) =>
  `${req.protocol}://${req.get("host")}/uploads/profile-pictures/${file.filename}`;

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).populate("savedSchemes");
  const searchHistory = await SearchHistory.find({ userId: req.user._id }).sort({ timestamp: -1 });

  res.json({
    ...user.toObject(),
    password: undefined,
    searchHistory
  });
};

export const updateProfile = async (req, res) => {
  const updates = { ...req.body };

  if (req.file) {
    updates.profilePicture = buildProfilePictureUrl(req, req.file);
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true
  }).populate("savedSchemes");

  res.json({
    message: "Profile updated successfully",
    user
  });
};

export const saveScheme = async (req, res) => {
  const { schemeId } = req.body;
  const user = await User.findById(req.user._id);

  if (!user.savedSchemes.some((item) => item.toString() === schemeId)) {
    user.savedSchemes.push(schemeId);
    await user.save();
  }

  const populatedUser = await User.findById(req.user._id).populate("savedSchemes");

  res.json({
    message: "Scheme saved successfully",
    savedSchemes: populatedUser.savedSchemes
  });
};
