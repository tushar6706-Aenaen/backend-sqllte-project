import jwt from 'jsonwebtoken';

// Middleware to protect routes
function authMiddleware(req, res, next) {
    // Get token from headers - handle both "Bearer token" and direct token
    const authHeader = req.headers['authorization'];
    let token;
    
    if (authHeader) {
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1]; // "Bearer <token>"
        } else {
            token = authHeader; // Direct token
        }
    }

    console.log('🔐 Auth middleware - Token received:', token ? 'Yes' : 'No');

    if (!token) {
        console.log('❌ No token provided');
        return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('❌ Invalid token:', err.message);
            return res.status(401).json({ message: "Invalid token" });
        }

        // Save userId from payload
        req.userId = decoded.id;
        console.log('✅ Token valid, user ID:', req.userId);
        next();
    });
}

export default authMiddleware;
