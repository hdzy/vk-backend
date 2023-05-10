import jwt from "jsonwebtoken";

export default (req, res, next) => {
    const token = (req.headers.authorization || "").replace("Bearer ", "");

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret');

            req.userID = decoded._id;
            next();
        }
        catch (err) {
            res.status(403).json({ message: "Invalid token" });
        }
    }
    else {
        res.status(403).json({ message: "No token provided" });
    }
};