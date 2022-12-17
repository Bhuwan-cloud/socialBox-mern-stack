import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        //  grabbing jwt token from frontend 
        let token = req.header("Authorization");

        // if token does not exists
        if (!token) return res.status(403).send("Access Denied");
        //  token will be placed after Bearer 
        if (token.startsWith("Bearer ")) { token = token.slice(7, token.length).trimLeft(); }

        // verifyling jwt token 
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();

    } catch (err) {
        res.status(500).json({ error: err.message }); 
    }
}