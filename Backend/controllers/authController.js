import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import httpStatusText from '../utils/httpStatusText.js';
import User from '../models/user.js';
import { validationResult } from 'express-validator';
import AppErr from '../utils/appError.js';
import catchAsync from '../middleware/catchAsync.js';



const postLogin = catchAsync(async (req, res, next) => {

    //const {phone} = req.body.phone;
    const { email, password } = req.body;

    if (!email || !password) {
        const error = new AppErr('Email and password must be provided', httpStatusText.FAIL, 401);
        return next(error);
    }

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
        const error = new AppErr('User not found', httpStatusText.FAIL, 404);
        return next(error);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        const error = new AppErr('Wrong email or password', httpStatusText.FAIL, 401);
        return next(error);
    }

    const token = jwt.sign({
        //phone: user.phone,
        userId: user.id
    }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ status: httpStatusText.SUCCESS, token: token, user: user });
})

const postSignup = catchAsync(async (req, res, next) => {


    const { phone, name, password, email, role } = req.body;
    //console.log(phone, name, password, email, role);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessage = errors.errors[0].msg;
        const error = new AppErr(errorMessage, httpStatusText.FAIL, 400);
        return next(error);
    }

    let user = await User.findOne({ where: { phone: phone } });
    if (user) {
        const error = new AppErr('This phone already used, try another one', httpStatusText.FAIL, 400);
        return next(error);
    };

    user = await User.findOne({ where: { email: email } });
    if (user) {
        const error = new AppErr('This email already used, try another one', httpStatusText.FAIL, 400);
        return next(error);
    };

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
        phone,
        name,
        password: hashedPassword,
        email,
        role
    })
    res.status(201).json({ stats: httpStatusText.SUCCESS, data: user });

})

const verifyUser = catchAsync(async (res, req, next) => {
    const { userId } = req.params;
    const user = req.user
    user.verified = true;
    await user.save();
    res.status(200).json({ status: httpStatusText.SUCCESS, data: null });

});

const postLogout = catchAsync(async (req, res, next) => {
    res.status(200).json({ stats: httpStatusText.SUCCESS, data: { message: 'Logged out successfully' } });
})

export default {
    postLogin,
    postSignup,
    postLogout,
    verifyUser
}