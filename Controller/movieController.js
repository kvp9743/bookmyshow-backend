import { movieModel } from "../Model/movieModel.js";

const getAllMovies = async (req, res) => {
  try {
    const allMovies = await movieModel.find();
    res.status(200).send({
      success: true,
      message: "Movie data fetched!",
      data: allMovies || [],
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
const getMovieById = async (req, res) => {
  try {
    const allMovies = await movieModel.findById(req.query.movieId);
    res.status(200).send({
      success: true,
      message: "Movie data fetched!",
      data: allMovies || [],
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
const addMovie = async (req, res) => {
  try {
    const newMovie = new movieModel(req?.body);
    const data = await newMovie.save();
    res.status(200).send({
      success: true,
      message: "Movie added successfully!",
      data: data,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
const updateMovie = async (req, res) => {
  try {
    await movieModel.findByIdAndUpdate(req.body._id, req.body);
    res.status(200).send({
      success: true,
      message: "Movie updated successfully!",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
const deleteMovie = async (req, res) => {
  try {
    await movieModel.findByIdAndDelete(req.body._id);
    res.status(200).send({
      success: true,
      message: "Movie deleted successfully!",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

export { getAllMovies, addMovie, updateMovie, deleteMovie, getMovieById };
