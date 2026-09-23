import bcrypt from "bcrypt";
import { userModel } from "../Model/userModel.js";
import jsonwebtoken from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Name, email and password are required",
      });
    }
    const userExists = await userModel.findOne({ email: req?.body?.email });

    if (userExists)
      return res
        .status(409)
        .send({ success: false, message: "User email already exists!" });
    else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new userModel({
        name: name,
        email: email,
        password: hashedPassword,
      });
      const userDetails = await newUser.save();
      return res.status(201).send({
        success: true,
        message: "User Registered Successfully!",
        data: { name: userDetails.name, email: userDetails.email },
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email and password are required",
      });
    }
    const userExists = await userModel.findOne({ email });

    if (!userExists)
      return res
        .status(409)
        .send({ success: false, message: "User email not found!" });

    const validateUser = await bcrypt.compare(password, userExists.password);
    if (validateUser) {
      const bmstoken = jsonwebtoken.sign(
        { userId: userExists._id },
        process.env.secretKey,
        { expiresIn: "1d" },
      );
      res.cookie("bmstoken", bmstoken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.status(200).send({
        success: true,
        message: "User Logged in Successfully!",
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "Invalid password! Please try again.",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "LogIn failed!",
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userData = await userModel.findById(req?.userId);
    res.status(200).send({
      success: true,
      message: "User Details fectched!",
      data: userData,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Cannot gfetch user Details!",
    });
  }
};

const logOutUser = async (req, res) => {
  try {
    res.clearCookie("bmstoken");

    return res.status(200).send({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Logout failed!",
    });
  }
};

export { registerUser, loginUser, getUserDetails, logOutUser };
