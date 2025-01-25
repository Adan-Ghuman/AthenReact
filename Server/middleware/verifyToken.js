import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized - no token provided' });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('decoded: ', decoded);
        

        if (!decoded) return res.status(401).json({ success: false, message: 'Unauthorized - invalid token' });
        
        req.id = decoded.id;
        next();
    } catch (error) {
        console.log('Error in verifyToken: ', error);
        res.status(400).json({ success: false, message: 'server error' });
    }
}