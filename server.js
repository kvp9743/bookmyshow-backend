import express from "express";
import "dotenv/config";
import { userRouter } from "./Routes/userRouter.js";
import "./DBconnect/dbconnect.js";
import cookieParser from "cookie-parser";
import { movieRouter } from "./Routes/movieRouter.js";
import { theaterRouter } from "./Routes/theaterRouter.js";
import { bookingRouter } from "./Routes/bookingRouter.js";

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/user/movies", movieRouter);
app.use("/api/user/theaters", theaterRouter);
app.use("/api/user/booking", bookingRouter);

app.listen(port, () => {
  console.log("server is running at port:- " + port);
});
