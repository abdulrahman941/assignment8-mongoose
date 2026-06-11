import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    try {
        // 1. Get the token from headers
        const authHeader=req.headers.authorization
        // 2. Check if token exists
        if (!authHeader|| !authHeader.startsWith("Bearer")) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }
        const token=authHeader.split(" ")[1]

        // 3. Verify the token
        // Replace 'secret_key' with your actual secret key used in login
        const decoded = jwt.verify(token, 'Route');

        // 4. Attach user info to the request object
        req.userId = decoded.userId;

        // 5. Move to the next function (Controller)
        next();
    } catch (error) {
        return res.status(401).json({ 
            message: "Invalid or expired token.", 
            error: error.message 
        });
    }
};