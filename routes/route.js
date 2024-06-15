const Routes = require("express").Router();

Routes.use("/users", require("./userRoutes.js"));

module.exports = Routes;
