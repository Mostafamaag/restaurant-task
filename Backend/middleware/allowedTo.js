import AppErr from '../utils/appError.js'
import httpStatusText from '../utils/httpStatusText.js';

export default (...roles) => {
    return async (req, res, next) => {
        const user = req.user;
        if (!roles.includes(user.role)) {
            const error = new AppErr('Not Authorized, you do not have the required permissions', httpStatusText.FAIL, 403);
            return next(error);
        }
        next();
    }
}