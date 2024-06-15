const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: [true, "Please Provide a userName"] },
  email: {
    type: String,
    required: [true, "Please Provide a email"],
    unique: true,
  },
  password: { type: String, required: [true, "Please Provide password"] },
  isVerified: { type: Boolean, default: false },
  verifyToken: { type: String },
  verifyTokenExpiry: { type: Date },
});

const user = mongoose.models.users || mongoose.model("users", userSchema);

module.exports = user;
