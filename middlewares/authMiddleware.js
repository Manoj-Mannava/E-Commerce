import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const requireSignIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            console.log('No token provided');
            return res.status(401).send({ success: false, message: 'Authentication failed: No token provided' });
        }

        console.log('Token:', token);

        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        console.log('Decoded:', decoded);

        req.user = decoded;
        next();
    } catch (error) {
        console.log('JWT Verification Error:', error);
        res.status(401).send({
            success: false,
            message: 'Authentication failed',
        });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (user.role !== 1) {
            return res.send({
                success: true,
                message: "UnAuthorized Access,only admin can add new products",
            });
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            error,
            message: "Error in admin middleware",
        });
    }
};