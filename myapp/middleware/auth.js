const jwt = require('jsonwebtoken'); 
const User = require('../models/user'); 

const protect = async (req, res, next) => { // 3
    let token;

    // 5. Check if the Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 6. Get token from header (Bearer <TOKEN>)
            token = req.headers.authorization.split(' ')[1]; // Splits "Bearer TOKEN" into ["Bearer", "TOKEN"] and takes the second element.

            // 7. Verify token
            // This method checks if the token is valid (not tampered with, not expired)
            // using the secret key that was used to sign it.
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // 8

            // 9. Find the user associated with the token's payload
            // decoded.userId comes from the JWT payload we defined in userRoutes.js:
            // jwt.sign({ userId: user._id, username: user.username }, ...)
            req.user = await User.findById(decoded.userId).select('-password'); // 10

            // 11. Check if user exists (edge case: user deleted after token issued)
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // 12. If everything is successful, pass control to the next middleware/route handler

        } catch (error) {
            // 13. Handle token verification failures
            console.error('Token verification error:', error); // Log the detailed error for debugging
            return res.status(401).json({ message: 'Not authorized, token failed' }); // Send a generic error response to the client
        }
    }

    // 14. If no token is provided in the Authorization header at all
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect }; // 15