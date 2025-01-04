
import express from 'express';
import authController from '../controllers/authController.js';
import { body } from 'express-validator';

const router = express.Router()


router.post('/login',
    [
        body('email', 'Enter a valid email')
            .isEmail()
            .normalizeEmail(),
        body('password',)
            .isLength({ min: 5 }).withMessage('Your password must be at least 5 characters')
            .isAlphanumeric().withMessage('Your password must contains numbers and letters')
            .trim(),
    ],
    authController.postLogin
)

router.post('/signup',
    [
        body('name', 'Name must be not empty!')
            .notEmpty(),
        body('phone', 'Enter a valid phone')
            .notEmpty()
            .trim(),
        body('email', 'Enter a valid email')
            .isEmail()
            .normalizeEmail(),
        body('password',)
            .isLength({ min: 5 }).withMessage('Your password must be at least 5 characters')
            .isAlphanumeric().withMessage('Your password must contains numbers and letters')
            .trim(),
    ]
    , authController.postSignup
);
router.get('/verify/userId', authController.verifyUser);
router.post('/logout', authController.postLogout)

export default router;