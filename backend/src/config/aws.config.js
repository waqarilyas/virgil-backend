const AWS = require('aws-sdk');
const CONFIG = require('./default');

AWS.config.update({
  accessKeyId: CONFIG.AWS.accessKeyId,
  secretAccessKey: CONFIG.AWS.secretAccessKey
});