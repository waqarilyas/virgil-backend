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
    res.status(err.statusCode).send({
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
    res.status(err.statusCode).send({
      status: false,
      message: err.message,
    });
  }
};

const forgotPassword = async (params, res) => {
  try {
    const emailExist = await User.findOne({ email: params.email });

    if (!emailExist) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "No users found with this email"
      );
    }

    await AUX.sendEmail(
      params.email,
      "Password reset email",
      `Your password reset token for Virgil app is ${params.code}`
    );
    res.status(httpStatus.OK).send({
      status: false,
      message: "Password Reset code sent successfully on your email address",
    });
  } catch (err) {
    res.status(err.statusCode).send({
      status: false,
      message: err.message,
    });
  }

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
