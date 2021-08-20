const AWS = require("aws-sdk");
const httpStatus = require("http-status");
const { isValidObjectId } = require("mongoose");
const CONFIG = require("../config/default");
const MAILER = require("../config/mailer.config");

exports.uploadToAws = function (pdfBuffer, filename, contentType) {
  return new Promise((resolve, reject) => {
    try {
      const s3 = new AWS.S3();
      const base64Data = pdfBuffer;

      const params = {
        Bucket: CONFIG.AWS.bucket,
        Key: `${CONFIG.DB_NAME}/${filename}`,
        Body: base64Data,
        ACL: "public-read",
        ContentEncoding: "base64", // required
        // ContentType: `application/pdf`
        ContentType: contentType,
      };
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    } catch (error) {
      console.log("Uploading to amazon error", error);
      reject(err);
    }
  });
};

// exports.deleteFromAWS = function (key) {
//     return new Promise((resolve, reject) => {
//         try {
//             const s3 = new AWS.S3();
//             var params = {
//                 Bucket: CONFIG.aws.bucket,
//                 Key: `${CONFIG.DB_NAME}/${key}`
//             }
//             s3.deleteObject(params, (err, data) => {
//                 if (err) {
//                     console.log(err);
//                     reject();
//                 } else {
//                     resolve(data);
//                 }
//             })
//         } catch (error) {
//             console.log(error);
//             reject()
//         }
//     })
// }

exports.sendEmail = function (to, subject, message) {
  return new Promise((resolve, reject) => {
    var mailOptions = {
      from: CONFIG.senderEmail,
      to: to,
      subject: subject,
      text: message,
    };
    MAILER.send(mailOptions)
      .then((info) => {
        resolve(info);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};
exports.checkIfValidId = function (id, res) {
  if (!isValidObjectId(id)) {
    return res.status(httpStatus.BAD_REQUEST).send({
      status: false,
      message: "invalid id",
    });
  }
};

exports.apiResposne = (response, statusCode, status, msg) => {
  response.status(statusCode).send({
    status: status,
    message: msg,
  });
};
