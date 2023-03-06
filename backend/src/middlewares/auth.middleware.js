// interceptor for protected calls
const JWT = require("jsonwebtoken");
const CONFIG = require("../config/default");

const AUTHENTICATE = (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith(CONFIG.AUTH_HEADER_PREFIX)
  ) {
    Unauthorized(res);
    return;
  }
  var authToken = req.headers.authorization.split(" ")[1];
  JWT.verify(authToken, CONFIG.tokenKey, async (err, decoded) => {
    if (err) {
      Unauthorized(res);
      return;
    } else {
      if (!decoded || !decoded.sub) {
        Unauthorized(res);
        return;
      } else {
        req.userId = decoded.sub;
        next();
      }
    }
  });
};

const Unauthorized = (res) => {
  res.status(403).send({
    status: false,
    message: "Unauthorized",
  });
};

module.exports = {
  AUTHENTICATE,
};
