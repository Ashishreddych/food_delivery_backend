// verifytoken.js
const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

dotEnv.config()

const secretKey = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
    // Extract token from Authorization header
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Token is required" });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        const vendor = await Vendor.findById(decoded.vendorId);

        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        req.vendorId = vendor._id;
        next();  // Proceed to next middleware or route handler
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Invalid or expired token" });
    }
};

module.exports = verifyToken;
