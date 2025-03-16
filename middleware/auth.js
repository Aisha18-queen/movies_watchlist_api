const jwt = require('jsonwebtoken')

require('dotenv').config();

module.exports = (request, response, next) => {
    try {
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
        request.userId = decodedToken.userId;
        next();
    } catch (error) {
        response.status(401).json("Authentication failed.")
    }
};