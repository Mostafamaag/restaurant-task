import User from '../models/user';
import AppErr from '../utils/appError';
import httpStatusText from '../utils/httpStatusText';
import catchAsync from '../middleware/catchAsync';



// const verifyUser = catchAsync(async (res, req, next) => {
//     const { userId } = req.params;
//     const user = req.user
//     user.verified = true;
//     await user.save();
//     res.status(200).json({ status: httpStatusText.SUCCESS, data: null });

// });