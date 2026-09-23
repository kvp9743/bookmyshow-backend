import mongoose from "mongoose";

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

export const theaterModel = mongoose.model("theaters", theaterSchema);
