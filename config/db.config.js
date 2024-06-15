const mongoose = require("mongoose");

mongoose.connect(process.env.MONGOOSE_URL);

const connection = mongoose.connection;

connection.on("connected", () => console.log("mongodb is connected"));

connection.on("error", (err) => {
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running." + err
  );
  process.exit();
});
