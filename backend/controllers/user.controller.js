import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";
import ConnectionRequest from "../models/connections.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const convertUserDataTOPDF = async (userData) => {
  const doc = new PDFDocument();
  //we want that whenever changes are made to the file , each time we will get a new pdf file name with download
  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  // const stream = fs.createWriteStream("uploads/", outputPath);
  const stream = fs.createWriteStream(
    path.join(__dirname, "..", "uploads", outputPath),
  );

  doc.pipe(stream);

  doc.image(`uploads/${userData.userId.profilePicture}`, {
    align: "center",
    width: 100,
  });
  doc.fontSize(14).text(`Name: ${userData.userId.name}`);
  doc.fontSize(14).text(`Userame: ${userData.userId.username}`);
  doc.fontSize(14).text(`Email: ${userData.userId.email}`);
  doc.fontSize(14).text(`Bio: ${userData.userId.bio}`);
  doc.fontSize(14).text(`Current Position: ${userData.currentPosition}`);
  doc.fontSize(14).text("Past Work: ");
  userData.pastWork.forEach((work, index) => {
    doc.fontSize(14).text(`Company Name: ${work.company}`);
    doc.fontSize(14).text(`Position: ${work.position}`);
    doc.fontSize(14).text(`Years: ${work.years}`);
  });

  doc.end();

  return outputPath;
};

export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });

    const user2 = await User.findOne({ username });

    if (user2 || user)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
      token,
    });
    await newUser.save();

    res.cookie("token", token, {
      httpOnly: true, //cant be accessed by any other JS
      secure: true, //true in production with HTTPS
      sameSite: "none",
      maxAge: 48 * 60 * 60 * 1000,
    });

    const profile = new Profile({
      userId: newUser._id,
    });
    await profile.save();
    return res.json({ message: "User Registered" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne({ _id: user._id }, { token });
    // return res.json({ message: "User logged in successfully" });
    res.cookie("token", token, {
      httpOnly: true, //cant be accessed by any other JS
      secure: true, //true in production with HTTPS
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const { token } = req.cookies;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePicture = req.file.filename;
    await user.save();
    return res.json({ message: "Profile Picture Updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { ...newUserInfo } = req.body;
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "User not found" });
    const { username, email } = newUserInfo;
    //now finding existing user by using username or email
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    //situation where we try to use some other user's info for our account
    if (existingUser && !user._id.equals(existingUser._id)) {
      return res.status(400).json({ message: "User already exists" });
    }
    Object.assign(user, newUserInfo);
    user.save();
    return res.json({ message: "User Updated" });
  } catch (err) {
    return res.json(500).json({ message: err.message });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.cookies;
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture",
    );

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json({ profile: userProfile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { token } = req.cookies;
    const newProfileData = req.body;

    //find user by using token
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //now use user id to get its profile
    const profile = await Profile.findOne({ userId: user._id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    Object.assign(profile, newProfileData);

    await profile.save();

    return res.json({ message: "Profile Updated" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//to get all users based on a particular search
export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name username email profilePicture",
    );
    return res.json({ profiles });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//downloading profile in pdf form
export const downloadProfile = async (req, res) => {
  try {
    const user_id = req.query.id;
    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name username email profilePicture",
    );
    const outputPath = await convertUserDataTOPDF(userProfile);
    return res.json({ message: outputPath });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendConnectionRequest = async (req, res) => {
  const { token } = req.cookies;

  const { connectionId } = req.body;

  try {
    let user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connectionUser = await User.findOne({ _id: connectionId });

    if (!connectionUser) {
      return res.status(404).json({ message: "Connection User not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();
    return res.json({ message: "Request Sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//to whom User sent request
export const getMyConnectionsRequests = async (req, res) => {
  const { token } = req.cookies;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.message(404).json({ message: "User not found" });
    }

    const connections = await ConnectionRequest.find({
      userId: user._id,
    }).populate("connectionId", "name username email profilePicture");

    return res.json({ connections });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//who send request to me
export const whatAreMyConnections = async (req, res) => {
  const { token } = req.cookies;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await ConnectionRequest.find({
      connectionId: user._id,
    }).populate("userId", "name username email profilePicture");

    return res.json({ connections });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  const { token } = req.cookies;
  const { requestId, action_type } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (action_type !== "accept" && action_type !== "reject") {
      return res.status(400).json({ message: "Invalid action type" });
    }

    const connection = await ConnectionRequest.findOne({
      _id: requestId,
      connectionId: user._id,
    });

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    if (action_type === "accept") {
      connection.status_accepted = true;
    } else {
      connection.status_accepted = false;
    }

    await connection.save();
    return res.json({ message: "Request Updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { token } = req.cookies;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    //delete token from database
    user.token = "";
    await user.save();

    //clear cookie from browser
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Logged out successfully!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUserProfileAndUserBasedOnUsername = async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture",
    );

    return res.json({ profile: userProfile });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
