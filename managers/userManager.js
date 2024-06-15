const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const mailer = require("../helper/mailer");

const logoutUser = async (req, res) => {
  try {
    const response = res.json({
      message: "Logout Successfull !",
      success: true,
    });
    return response;
  } catch (err) {
    return res.json({ error: err.message }, { status: 500 });
  }
};

const SignInUser = async (req, res) => {
  try {
    const checkUser = await userModel.findOne({ email: req.body.email });
    if (!checkUser)
      return res.json({ error: "user does not exists" }, { status: 400 });
    if (!checkUser.isVerified)
      return res.json({ error: "Email Not Verified !" }, { status: 400 });
    const validPassword = await bcrypt.compare(
      req.body.password,
      checkUser.password
    );
    if (!validPassword)
      return res.json(
        { message: "Invalid Email or Password !" },
        { status: 400 }
      );
    const tokenData = {
      id: checkUser._id,
      email: checkUser.email,
      password: checkUser.password,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_TOKEN_SECRET, {
      expiresIn: "3d",
    });

    const response = res.json({
      message: "Login Successfull !",
      success: true,
      token: token,
    });

    return response;
  } catch (err) {
    return res.json({ error: err.message }, { status: 500 });
  }
};

const loginedUser = async (req, res) => {
  try {
    const decodedToken = jwt.verify(
      req.query.token,
      process.env.JWT_TOKEN_SECRET
    );

    const userResponse = await userModel
      .findOne({ _id: decodedToken.id })
      .select("-password");
    return res.json({ message: "User Found", data: userResponse });
  } catch (err) {
    return res.json({ error: err.message }, { status: 400 });
  }
};

const signUp = async (req, res) => {
  try {
    const checkUser = await userModel.findOne({ email: req.body.email });
    if (checkUser)
      return res.json({
        message: "User Already Exists !",
        status: 400,
      });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    const createUser = await userModel.create(req.body);

    await mailer(createUser.email, "verify", createUser._id);

    return res.json({ message: "User Created", status: 200 });
  } catch (error) {
    return res.json({ error: error.message }, { status: 500 });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const userResponse = await userModel.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: new Date() },
    });
    if (!userResponse)
      return res.json({ error: "Invalid Token" }, { status: 400 });

    userResponse.isVerified = true;
    userResponse.verifyToken = undefined;
    userResponse.verifyTokenExpiry = undefined;
    await userResponse.save();
    return res.json({ message: "Email Verified Successfully !" });
  } catch (err) {
    return res.json({ error: err.message }, { status: 500 });
  }
};

module.exports = {
  SignInUser,
  logoutUser,
  loginedUser,
  signUp,
  verifyEmail,
};
