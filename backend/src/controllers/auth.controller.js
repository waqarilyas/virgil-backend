const JWT = require("jsonwebtoken");
const CONFIG = require("../config/default");

const BCRYPT = require("bcrypt");
const AUX = require("../helpers/auxilaries");
const EVENT = require("../triggers/custom-events").customEvent;

const { User } = require("../models");
const { createUser } = require("../services/user.service");
const { generateAuthTokens } = require("../services/token.service");

//Simple version, without validation or sanitation
const test = function (req, res) {
  res.status(200).send({
    status: true,
  });
};
const register = async (params, res) => {
  try {
    const user = await createUser(params);
    const tokens = await generateAuthTokens(user);
    res.status(httpStatus.OK).send({ user, tokens });
  } catch (err) {
    res.status(err.statusCode).send({
      status: false,
      message: err.message
    })
  }


  // //check if user already in database

  // try {
  //   const emailExist = await User.findOne({ email: req.email });
  //   if (emailExist) {
  //     return res.status(400).send({
  //       status: false,
  //       message: "Email already exists",
  //     });
  //   }

  //   //Hash the password
  //   const salt = await BCRYPT.genSalt(10);
  //   const hashedPassword = await BCRYPT.hash(req.password, salt);

  //   //create new user
  //   const user = new User({
  //     first_name: req.first_name,
  //     last_name: req.last_name,
  //     email: req.email,
  //     password: hashedPassword,
  //     country: req.country,
  //     zip: req.zip,
  //     city: req.city,
  //   });

  //   const savedUser = await user.save();

  //   //create and assign a token
  //   const token = JWT.sign({ _id: savedUser._id }, CONFIG.tokenKey);
  //   let usr = savedUser.toObject();
  //   delete usr["password"];

  //   res.status(200).send({
  //     status: true,
  //     token: token,
  //     message: "User registered successfully",
  //     user: usr,
  //   });
  // } catch (err) {
  //   res.status(400).send({
  //     status: false,
  //     message: err,
  //   });
  // }
};

const login = async (req, res) => {
  //check if user exists
  const user = await User.findOne({ email: req.email });
  if (!user) {
    return res.status(400).send("Email not found");
  }
  //check if password is correct
  const validPass = await BCRYPT.compare(req.password, user.password);
  if (!validPass) {
    return res.status(400).send("Invalid Password");
  }

  //create and assign a token
  const token = JWT.sign({ _id: user._id }, CONFIG.tokenKey);
  let usr = user.toObject();
  delete usr["password"];

  res.header("authorization", token).send({
    status: true,
    authorization: token,
    message: "successfully logged in",
    user: usr,
  });
};

const forgotPassword = async (req, res) => {
  // const emailExist = await User.findOne({ email: req.email });
  // if (!emailExist) {
  //   return res.status(400).send({
  //     status: false,
  //     message: "Email does not exist",
  //   });
  // }
  // const token = JWT.sign({ _id: req.email }, CONFIG.tokenKey, {
  //   expiresIn: 86400,
  // });

  // const msg = {
  //   to: req.email,
  //   from: "siteseekrr@gmail.com",
  //   subject: "Password reset email",
  //   text: "Change Your Password",
  //   html: `<a href="http://localhost:3000/newPassword/${token}">Click Here To change your Password</a>`,
  // };

  // sgMail
  //   .send(msg)
  //   .then(async () => {
  //     const passwordToSave = new PasswordToken({
  //       token,
  //     });
  //     await passwordToSave.save();
  //     res.status(400).send({
  //       status: false,
  //       message: "Password Reset email sent successfully on your email address",
  //     });
  //   })
  //   .catch((error) => {
  //     res.status(400).send({
  //       status: false,
  //       message: error,
  //     });
  //   });
};

const verifyCode = async (req, res) => {
  const user = await User.findOneAndUpdate({ email: req.email }, {});
  res.status(200).send({
    status: true,
    req,
  });
};

const changePassword = async (req, res) => {
  try {
    console.log("------req----", req.body);

    // const salt = await BCRYPT.genSalt(10);
    // const hashedPassword = await BCRYPT.hash(req.password, salt);

    // await User.findOneAndUpdate(
    //   { email: req.email },
    //   {
    //     password: hashedPassword,
    //   },
    //   {
    //     insert: true,
    //   }
    // );

    res.status(200).send({
      status: true,
      message: "Password Updated Successfullly",
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Unable to change password",
    });
  }
};

module.exports = {
  test: test,
  register,
  login,
  forgotPassword,
  verifyCode,
  changePassword,
};
