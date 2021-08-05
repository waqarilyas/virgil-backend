const { validationResult } = require('express-validator');

const HAS_ERROR = function (request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({
            status: false,
            errors: errors.mapped()
        });
    } else {
        return false;
    }
}

module.exports = {
    HAS_ERROR
}