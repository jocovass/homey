import express, { Request, Response, NextFunction } from 'express';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { IUserBack, User } from '../models/userModel';

// create a subrouter on /api/v1/users
const router = express.Router();

declare module 'express-serve-static-core' {
    interface Request {
        user?: IUserBack;
    }
}

type SignupProps = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

// logout
// updateprofile
// updateimage
// signupwithinvitation
// resetpassword

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

router.post(
    '/signup',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { firstName, lastName, email, password }: SignupProps =
                req.body;

            const user = await User.create({
                email,
                firstName,
                lastName,
                password,
            });

            createSendToken(user, 201, req, res);
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'Bad request' });
        }
    },
);

router.post(
    '/login',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password }: { email: string; password: string } =
                req.body;
            const user = await User.findOne({ email });

            if (!user || !(await user.comparePassword(password))) {
                return next({
                    statusCode: 401,
                    message: 'Email or password is not correct.',
                });
            }

            createSendToken(user, 200, req, res);
        } catch (error: any) {
            return next({
                statusCode: 500,
                message: error?.message || 'Something went wrong',
            });
        }
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

router.use(async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;
        const { authorization } = req.headers;
        if (authorization && authorization.startsWith('Bearer')) {
            token = authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return next({
                statusCode: 401,
                message: 'Unauhtorized! Please log in to get access.',
            });
        }

        const decoded: TokenPayload = await validateToken(token);

        const user = await User.findById(decoded.id);

        if (!user) {
            return next({
                statusCode: 401,
                message: 'The token is invalid or expired.',
            });
        }

        req.user = user;
        next();
    } catch (error: any) {
        return next({
            statusCode: 500,
            message: error.message,
        });
    }
});

router.post(
    '/updateProfile',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // need to get the token from the cookie
            // decode the cooike check if it is valid expired/id has user in DB
            // if true perform the update if not reject de request
            res.status(200).json({
                message: 'successful implemented jwt',
                user: req.user,
            });
        } catch (error: any) {
            return next({
                statusCode: 500,
                message: 'errrrrrrr',
            });
        }
    },
);

export { router as userRouter };
