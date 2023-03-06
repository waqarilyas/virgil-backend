const JWT = require("jsonwebtoken");
const CONFIG = require("../config/default");
const httpStatus = require("http-status");
const BCRYPT = require("bcrypt");
const AUX = require("../helpers/auxilaries");
const EVENT = require("../triggers/custom-events").customEvent;
const { User } = require("../models");

const {
  createUser,
  getUserByEmail,
  changeUserPassword,
  updateUserDeviceId,
} = require("../services/user.service");
const {
  generateAuthTokens,
  removeToken,
} = require("../services/token.service");
const {
  loginUserWithEmailAndPassword,
  authchangePassword,
} = require("../services/auth.service");
const { AUTHENTICATE } = require("../middlewares/auth.middleware");

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
    const { email, password, deviceId } = params;
    const user = await loginUserWithEmailAndPassword(email, password);
    await removeToken(user);
    const tokens = await generateAuthTokens(user);
    const dbUser = await updateUserDeviceId(user._id, deviceId);
    res.send({ user: dbUser, tokens });
  } catch (err) {
    res.status(httpStatus.BAD_REQUEST).send({
      status: false,
      message: err.message,
    });
  }
};

const forgotPassword = async (params, res) => {
  try {
    const emailExist = await getUserByEmail(params.email);

    if (!emailExist) {
      return AUX.apiResposne(
        res,
        httpStatus.NOT_FOUND,
        false,
        "Email doesn't exit."
      );
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

const resetPassword = async (req, res) => {
  try {
    const emailExist = await getUserByEmail(req.email);

    if (!emailExist) {
      return AUX.apiResposne(
        res,
        httpStatus.NOT_FOUND,
        false,
        "Email doesn't exit."
      );
    }

    const salt = await BCRYPT.genSalt(10);
    const hashedPassword = await BCRYPT.hash(req.password, salt);
    await changeUserPassword(req.email, hashedPassword);

    return AUX.apiResposne(
      res,
      httpStatus.OK,
      true,
      "Password changed successfully"
    );
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Unable to change password",
    });
  }
};

const socialLogin = async (params, res) => {
  try {
    const user = await getUserByEmail(params.email);

    if (user) {
      await removeToken(user);
      const tokens = await generateAuthTokens(user);
      return res.send({ user, tokens });
    } else {
      let firstName = "",
        lastName = "";
      const splittedArr = params.name.split(" ");

      firstName = splittedArr[0];
      if (splittedArr.length > 1) {
        lastName = splittedArr[1];
      }
      const userData = {
        firstName,
        lastName,
        email: params.email,
        deviceId: params.deviceId,
        platform: params.platform,
        deviceId: params.deviceId,
        isSocial: true,
      };
      const user = await createUser(userData);
      const tokens = await generateAuthTokens(user);
      res
        .status(httpStatus.OK)
        .send({ message: "User signup successfull", user, tokens });
    }
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const logout = async (params, res) => {
  try {
    const user = await User.findOne({ _id: params.userId });
    await removeToken(user);
    res.status(httpStatus.OK).send({
      status: true,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const changePassword = async (params, res) => {
  try {
    const { password, oldPassword, userId } = params;
    const user = await authchangePassword(userId, oldPassword, password);
    res.status(httpStatus.OK).send({
      status: true,
      message: "Password changed successfully",
      user,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

module.exports = {
  test: test,
  register,
  login,
  forgotPassword,
  verifyCode,
  resetPassword,
  socialLogin,
  logout,
  changePassword,
};
