const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const nodemailer = require("nodemailer");

const mailer = async (email, emailType, userId) => {
  try {
    const generatedOtp = generateOTP();

    let hashedToken;

    if (emailType == "verify") {
      hashedToken = await bcrypt.hash(generatedOtp, 10);
      await userModel.findByIdAndUpdate(
        userId,
        {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        },
        { new: true, runValidators: true }
      );
    }

    const transport = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      service:"Gmail",
      port: 465,
      secure:true,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: "temporary@gmail.com",
      to: email,
      subject: emailType == "verify" ? "Verify Your Email" : "Email Subject",
      html: `<p>click <a href="${
        process.env.DOMAIN
      }/verifyEmail?token=${hashedToken}">here</a> to ${
        emailType == "verify" ? "Verify Your Email" : "Email Html Code"
      }</p>
        <p>copy the below link in you browser</p>
        <span>${process.env.DOMAIN}/verifyEmail?token=${hashedToken}</span>
        `,
    };

    const response = await transport.sendMail(mailOptions);
  } catch (err) {
    throw new Error(err.message);
  }
};

const generateOTP = () => {
  let digits =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";
  let OTP = "";
  let len = digits.length;
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * len)];
  }
  return OTP;
};

module.exports = mailer;
