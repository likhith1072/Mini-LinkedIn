import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    
    if (!token) {
        return next(errorHandler(401, "Unauthorized: No token provided"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // Differentiate between token verification errors
            const message = err.name === 'TokenExpiredError' 
                ? "Session expired" 
                : "Invalid token";
            return next(errorHandler(403, `Forbidden: ${message}`));
        }
        
        req.user = user;
        next();
    });
};