import express from "express";
import { validateUserToken } from "../Middleware/authMiddleware.js";
import {
  createCheckoutSession,
  deleteBooking,
  getBookingByUserId,
  verifyPayment,
} from "../Controller/bookingController.js";

export const bookingRouter = express.Router();

bookingRouter.post(
  "/create-checkout-session",
  validateUserToken,
  createCheckoutSession,
);
bookingRouter.post("/verifyPayment", validateUserToken, verifyPayment);
bookingRouter.get("/getBookingByUserId", validateUserToken, getBookingByUserId);
bookingRouter.delete("/deleteBooking", validateUserToken, deleteBooking);
