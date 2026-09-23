import express from "express";
import {
  addShow,
  addTheater,
  deleteShow,
  deleteTheater,
  getAllTheaters,
  getShowById,
  getShowByMovieId,
  getShowByTheaterId,
  getTheaterByOwner,
  updateTheater,
} from "../Controller/theaterController.js";
import { validateUserToken } from "../Middleware/authMiddleware.js";

export const theaterRouter = express.Router();

theaterRouter.get("/getAllTheaters", validateUserToken, getAllTheaters);
theaterRouter.post("/addTheater", validateUserToken, addTheater);
theaterRouter.patch("/updateTheater", validateUserToken, updateTheater);
theaterRouter.delete("/deleteTheater", validateUserToken, deleteTheater);
theaterRouter.get("/getTheaterByOwner", validateUserToken, getTheaterByOwner);

//showApi

theaterRouter.post("/addShow", validateUserToken, addShow);
theaterRouter.delete("/deleteShow", validateUserToken, deleteShow);
theaterRouter.get("/getShowByMovieId", validateUserToken, getShowByMovieId);
theaterRouter.get("/getShowByTheaterId", validateUserToken, getShowByTheaterId);
theaterRouter.get("/getShowById", validateUserToken, getShowById);
