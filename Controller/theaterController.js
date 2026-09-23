import { showModel } from "../Model/showModel.js";
import { theaterModel } from "../Model/theaterModel.js";
import { userModel } from "../Model/userModel.js";

const getAllTheaters = async (req, res) => {
  try {
    const allMovies = await theaterModel.find().populate("owner");
    res.status(200).send({
      success: true,
      message: "Theater data fetched!",
      data: allMovies || [],
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

const getTheaterByOwner = async (req, res) => {
  try {
    const data = await theaterModel
      .find({ owner: req.userId })
      .populate("owner");

    res.status(200).send({
      success: true,
      message: "Theater data fetched!",
      data: data,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

const addTheater = async (req, res) => {
  try {
    const newItem = new theaterModel({ ...req?.body, owner: req.userId });

    const data = await newItem.save();
    res.status(200).send({
      success: true,
      message: "Theater added successfully!",
      data: data,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
const updateTheater = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);

    const updates = {
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
    };

    if (user.isAdmin && req.body.isActive !== undefined) {
      updates.isActive = req.body.isActive;
    }
    await theaterModel.findOneAndUpdate({ _id: req.body._id }, updates);
    res.status(200).send({
      success: true,
      message: "Theater updated successfully!",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
const deleteTheater = async (req, res) => {
  try {
    await theaterModel.findByIdAndDelete(req.body._id);
    res.status(200).send({
      success: true,
      message: "Theater deleted successfully!",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
const deleteShow = async (req, res) => {
  try {
    await showModel.findByIdAndDelete(req.body.showId);
    res.status(200).send({
      success: true,
      message: "Theater deleted successfully!",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

const getShowByTheaterId = async (req, res) => {
  try {
    const showData = await showModel
      .find({ theater: req.query.theater })
      .populate("movie");
    res.status(200).send({
      success: true,
      message: "Theater Shows fetched!",
      data: showData || [],
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

const getShowByMovieId = async (req, res) => {
  try {
    const showData = await showModel
      .find({ movie: req.query.movieId, date: req.query.date })
      .populate("theater")
      .sort({ time: 1 });

    const allUniqueTheaters = new Map();

    for (const show of showData) {
      let theaterId = show.theater._id.toString();
      if (!allUniqueTheaters.has(theaterId)) {
        const theater = show.theater.toObject();

        theater.shows = [];
        allUniqueTheaters.set(theaterId, theater);
      }
      allUniqueTheaters.get(theaterId).shows.push(show);
    }
    const theaterData = [...allUniqueTheaters.values()];

    res.status(200).send({
      success: true,
      message: "Theater Shows fetched!",
      data: theaterData || [],
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
const addShow = async (req, res) => {
  try {
    const newItem = new showModel(req?.body);

    const data = await newItem.save();
    res.status(200).send({
      success: true,
      message: "Show added successfully!",
      data: data,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

const getShowById = async (req, res) => {
  try {
    const showData = await showModel
      .findById(req.query.id)
      .populate("movie")
      .populate("theater");
    res.status(200).send({
      success: true,
      message: "Theater Shows fetched!",
      data: showData || [],
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
export {
  getAllTheaters,
  addTheater,
  updateTheater,
  deleteTheater,
  getTheaterByOwner,
  addShow,
  getShowByTheaterId,
  deleteShow,
  getShowByMovieId,
  getShowById,
};
