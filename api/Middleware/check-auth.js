const jwt = require('jsonwebtoken'); // Corrected the module name typo

module.exports = (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({ message: "Auth failed: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, "secret"); // Corrected variable name
        req.userData = decoded; // Optionally pass decoded data to the next middleware
        next(); // Proceed to the next middleware if token is valid
    } catch (err) {
        res.status(401).json({ message: "Auth failed" }); // Corrected typo in `status` and `message`
    }
};
