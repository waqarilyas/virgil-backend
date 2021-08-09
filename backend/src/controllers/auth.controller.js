const JWT = require("jsonwebtoken");
const CONFIG = require("../config/default");
const httpStatus = require("http-status");
const BCRYPT = require("bcrypt");
const AUX = require("../helpers/auxilaries");
const EVENT = require("../triggers/custom-events").customEvent;

const { User } = require("../models");
const { createUser } = require("../services/user.service");
const {
  generateAuthTokens,
  removeToken,
} = require("../services/token.service");
const { loginUserWithEmailAndPassword } = require("../services/auth.service");

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
    console.log(err);
    res.status(400).send({
      status: false,
      message: err.message,
    });
  }
};

const login = async (params, res) => {
  try {
    const { email, password } = params;
    const user = await loginUserWithEmailAndPassword(email, password);
    await removeToken(user);
    const tokens = await generateAuthTokens(user);
    res.send({ user, tokens });
  } catch (err) {
    res.status(httpStatus.BAD_REQUEST).send({
      status: false,
      message: err.message,
    });
  }
};

const forgotPassword = async (params, res) => {
  try {
    const emailExist = await User.findOne({ email: params.email });

    if (!emailExist) {
      return AUX.apiResposne(res, httpStatus.NOT_FOUND, false, "Email doesn't exit.");
    }

    await AUX.sendEmail(
      params.email,
      "Password reset email",
      `Your password reset token for Virgil app is ${params.code}`
    );
    res.status(httpStatus.OK).send({
      status: true,
      message: "Password Reset code sent successfully on your email address",
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
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
