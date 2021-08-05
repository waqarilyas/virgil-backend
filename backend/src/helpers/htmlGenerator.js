const path = require('path');
const ejs = require('ejs-promise');

const generate = (templateToUse, params) => {

    return new Promise(function (resolve, reject) {
        // Get the EJS file that will be used to generate the HTML
        const file = path.join(__dirname, `../public/${templateToUse}.ejs`);

        // Throw an error if the file path can't be found
        if (!file) {
            reject(`Could not find `);
        }

        ejs.renderFile(file, params, {}, (error, result) => {
            if (error) {
                reject(error);
            }
            result
                .then(function (data) {
                    resolve(data);
                }).catch((error) => {
                    reject(error);
                });
        });
    });
}

module.exports = {
    generate
};