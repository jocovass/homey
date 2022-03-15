import { Request, Response, NextFunction } from 'express';
import { sign } from 'jsonwebtoken';
import { Types } from 'mongoose';

import { IUserBack, User } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';

const SECRET = process.env.JWT_SECRET || 'TEST';
const signToken = (id: Types.ObjectId) => {
    return sign({ id }, SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

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
        message: 'Authentication was successfull',
        token,
        data: user,
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
