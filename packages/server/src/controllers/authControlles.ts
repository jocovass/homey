import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import crypto from 'crypto';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

import { sendPasswordResetEmail } from '../services/email';
import { IUserBack, User } from '../models/userModel';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

const SECRET = process.env.JWT_SECRET || 'TEST';
const signToken = (id: Types.ObjectId) => {
    return sign({ id }, SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// add properties to the request interface
declare module 'express-serve-static-core' {
    interface Request {
        user?: IUserBack;
        file?: Express.Multer.File;
    }
}

type CreateSendToken = (
    user: IUserBack,
    statusCode: number,
    req: Request,
    res: Response,
) => void;

const COOKIE_EXPIRES = Number(process.env.JWT_COOKIE_EXPIRES_IN) || 90;
const createSendToken: CreateSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);

    res.cookie('jwt', token, {
        expires: new Date(Date.now() + COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        httpOnly: true,
    });

    (user.password as any) = undefined;

    res.status(statusCode).json({
        token,
        data: {
            user,
        },
    });
};

type SignupProps = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};
export const singup = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { firstName, lastName, email, password }: SignupProps = req.body;

        const user = await User.create({
            email,
            firstName,
            lastName,
            password,
        });

        createSendToken(user, 201, req, res);
    },
);

export const login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password }: { email: string; password: string } =
            req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(user.password, password))) {
            return next(new AppError('Email or password is not correct.', 401));
        }

        createSendToken(user, 200, req, res);
    },
);

export const forgetPossword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email }: { email: string } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return next(
                    new AppError(
                        `There is no user with this email address ${email}`,
                        400,
                    ),
                );
            }

            req.user = user;

            const resetToken = user.createPasswordResetToken();
            await user.save({ validateBeforeSave: false });

            const resetURL = `${req.protocol}://${req.get(
                'host',
            )}/api/v1/users/reset_password/${resetToken}`;
            await sendPasswordResetEmail({
                emailTo: email,
                resetURL,
            });

            res.status(200).json({
                message: 'Password reset email is sent.',
            });
        } catch (error: any) {
            const { user } = req;

            if (user) {
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                await user.save({ validateBeforeSave: false });
            }
            throw error;
        }
    },
);

export const resetPassword = catchAsync(
    async (
        req: Request<
            { resetToken: string },
            Promise<void>,
            { password: string }
        >,
        res: Response,
        next: NextFunction,
    ) => {
        const { resetToken } = req.params;
        const { password } = req.body;

        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            return next(
                new AppError('Refresh token is expired or invalid.', 400),
            );
        }

        user.password = password;
        user.passwordResetExpires = undefined;
        user.passwordResetToken = undefined;
        user.save();

        res.status(200).json({
            message: 'Password was updated successfully.',
        });
    },
);

interface TokenPayload extends JwtPayload {
    id: Types.ObjectId;
}

const validateToken = (token: string): Promise<TokenPayload> => {
    return new Promise((resolve, reject) => {
        verify(token, SECRET, (error, decoded) => {
            if (error) return reject(error);

            resolve(decoded as TokenPayload);
        });
    });
};

export const authMiddelware = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        let token: string | undefined;
        const { authorization } = req.headers;
        if (authorization && authorization.startsWith('Bearer')) {
            token = authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return next(
                new AppError('Unauhtorized! Please log in to get access.', 401),
            );
        }

        const decoded: TokenPayload = await validateToken(token);

        const user = await User.findById(decoded.id);

        if (!user) {
            return next(new AppError('The token is invalid or expired.', 401));
        }

        req.user = user;
        next();
    },
);

export const logout = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        res.cookie('jwt', 'loggedout', {
            expires: new Date(Date.now() + 1000),
            httpOnly: true,
        });

        res.status(200).json({
            message: 'Logged out successfully.',
        });
    },
);
