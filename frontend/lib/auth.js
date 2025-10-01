// frontend/lib/auth.js
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Verifies the JWT token from cookies on the server-side.
 * @param {object} req - The Next.js request object from `context`.
 * @returns {object|null} The decoded user payload including the token, or null if invalid.
 */
export const verifyTokenAndGetUser = (req) => {
    try {
        if (!req.headers.cookie) {
            return null;
        }

        const cookies = cookie.parse(req.headers.cookie);
        const token = cookies.token;

        if (!token) {
            return null;
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Return the decoded payload along with the token for subsequent API calls
        return { ...decoded, token };

    } catch (error) {
        // Handles expired or invalid tokens
        return null;
    }
};