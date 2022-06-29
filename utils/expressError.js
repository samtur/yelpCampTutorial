
// Error class
class expressError extends Error {
    constructor(message, statusCode) {
        constructor(message, statusCode)

        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}
// Exporting error class to app.js
module.exports = expressError;