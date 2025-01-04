import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import AppErr from '../utils/appError.js';
import httpStatusText from '../utils/httpStatusText.js';

export default async (req, res, next) => {
    const authHeader = req.get('Authorization') || req.get('authorization');
    if (!authHeader) {
        const error = new AppErr('No token Provided', httpStatusText.FAIL, 401);
        return next(error);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decodedToken.userId;
        const user = await User.findByPk(userId);
        req.user = user;
    }
    catch (err) {
        const error = new AppErr('Invalid token', httpStatusText.FAIL, 401);
        return next(error)
    }
    next();
}