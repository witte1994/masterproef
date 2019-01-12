const jwt = require('jsonwebtoken');
const ENABLE_AUTH = false;

module.exports = (req, res, next) => {
    try {
        if (ENABLE_AUTH) {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, "dashboard_secret");
            req.clinicianData = decoded;
        }

        next();
    } catch(error) {
        return res.status(401).json({
            message: 'Authorization failed'
        });
    }
};