import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
    //get token from the header
    const token = req.header['authorization'];

    if (!token) {
        return res.status(401).json({ message: "no token provided" });
    }
    //verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){return res.status(401).json({message:"Invalid token"})}
        req.userId = decoded.id;
        next();
    })

}
