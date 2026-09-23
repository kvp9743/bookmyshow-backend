import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    show: {
      type: mongoose.Schema.ObjectId,
      ref: "shows",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
    },
    seats: {
      type: Array,
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },

    paymentStatus: {
      type: String,
      default: "paid",
    },
  },
  { timestamps: true },
);

const bookingModel = mongoose.model("bookings", bookingSchema);

export default bookingModel;
