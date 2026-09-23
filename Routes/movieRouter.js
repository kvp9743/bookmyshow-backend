import express from "express";
import {
  addMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
} from "../Controller/movieController.js";
import { validateUserToken } from "../Middleware/authMiddleware.js";
import { adminVerification } from "../Middleware/adminAuth.js";

export const movieRouter = express.Router();

movieRouter.get("/getAllMovies", validateUserToken, getAllMovies);
movieRouter.post("/addMovie", validateUserToken, adminVerification, addMovie);
movieRouter.patch(
  "/updateMovie",
  validateUserToken,
  adminVerification,
  updateMovie,
);
movieRouter.delete(
  "/deleteMovie",
  validateUserToken,
  adminVerification,
  deleteMovie,
);
movieRouter.get("/getMovieById", validateUserToken, getMovieById);
