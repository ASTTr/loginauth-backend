const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

require("dotenv").config();

require("./config/db.config.js");

app.use(cors());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api", require("./routes/route.js"));

app.listen(process.env.PORT, () => {
  console.log(`on port ${process.env.PORT}`);
});
