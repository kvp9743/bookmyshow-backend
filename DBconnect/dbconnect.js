import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8"]);

const url = process.env.dbURL;

mongoose
  .connect(url)
  .then(() => {
    console.log("Connection to DataBase is Successfull!");
  })
  .catch((err) => {
    console.log(err);
  });
