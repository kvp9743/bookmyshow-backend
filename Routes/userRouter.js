import express from "express";
import {
  getUserDetails,
  loginUser,
  logOutUser,
  registerUser,
} from "../Controller/userController.js";
import { validateUserToken } from "../Middleware/authMiddleware.js";

export const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/getUserDetails", validateUserToken, getUserDetails);
userRouter.post("/logOut", validateUserToken, logOutUser);
