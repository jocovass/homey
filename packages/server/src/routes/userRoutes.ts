import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { IUserBack, User } from '../models/userModel';
import { uploadAvatar } from '../config/cloudinary';
import { sendPasswordResetEmail } from '../services/email';

// create a subrouter on /api/v1/users
const router = express.Router();

// TODO: validation middleware
declare module 'express-serve-static-core' {
    interface Request {
        user?: IUserBack;
        file?: Express.Multer.File;
    }
}

type SignupProps = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

// signupwithinvitation

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

router.post('/forget_my_password', async (req, res, next) => {
    try {
        const { email }: { email: string } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return next({
                statusCode: 400,
                message: `There is no user with this email address ${email}`,
            });
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

        return res.status(200).json({
            message: 'Password reset email is sent.',
        });
    } catch (error: any) {
        try {
            const { user } = req;

            if (user) {
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                await user?.save({ validateBeforeSave: false });
            }

            return next({
                statusCode: 500,
                message: error.message,
            });
        } catch (error: any) {
            return next({
                statusCode: 500,
                message: error.message,
            });
        }
    }
});

router.post('/reset_password/:resetToken', async (req, res, next) => {
    try {
        const { resetToken }: { resetToken: string } = req.params;
        const { password }: { password: string } = req.body;

        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            return next({
                statusCode: 400,
                message: 'Refresh token is expired or invalid.',
            });
        }

        user.password = password;
        user.passwordResetExpires = undefined;
        user.passwordResetToken = undefined;
        user.save();

        return res.status(200).json({
            message: 'Password was updated successfully.',
        });
    } catch (error: any) {
        return next({
            statusCode: 500,
            message: error.message,
        });
    }
});

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

// isAuthenticated middleware
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

interface UpdateProfile {
    email?: string;
    firstName?: string;
    lastName: string;
    password?: string;
}
router.post(
    '/update_profile',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, firstName, lastName, password }: UpdateProfile =
                req.body;

            if (password) {
                return next({
                    statusCode: 404,
                    message:
                        'To update the password please use the /updatePassword endpoint.',
                });
            }

            const updatedUser = await User.findByIdAndUpdate(
                req.user?._id,
                {
                    email,
                    firstName,
                    lastName,
                },
                { new: true },
            );

            res.status(200).json({
                message: 'User updated successfully.',
                user: updatedUser,
            });
        } catch (error: any) {
            return next({
                statusCode: 500,
                message: error.message,
            });
        }
    },
);

router.post('/update_profile_image', uploadAvatar(), (req, res, next) => {
    try {
        const { file, user } = req;

        if (!file) {
            return next({
                statusCode: 404,
                message: 'Avatar is missing, did you forget to select an img?',
            });
        }

        // check if the user already has avtar cus we want to delete that
        if (user) {
            const prevAvatar = user.avatar;

            user.avatar = file.filename;
            user.save();

            if (prevAvatar) {
                // need to delete the old avatar so we don't have too many image in storage
                cloudinary.uploader.destroy(
                    prevAvatar,
                    { invalidate: true },
                    (error, result) => {
                        if (error) {
                            console.log(
                                `💥 Error while deleting avatar from cloudinary`,
                                error,
                            );
                        } else if (result) {
                            console.log(
                                `✅ Avatar successfully deleted from cloudinary`,
                                result,
                            );
                        }
                    },
                );
            }

            return res.status(200).json({
                data: file,
            });
        }
    } catch (error: any) {
        return next({
            statusCode: 500,
            message: error.message,
        });
    }
});

router.post('/update_password', async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = req.user;

        // check if the user password matches the given currentPassword
        if (!(await user?.comparePassword(currentPassword))) {
            return next({
                statusCode: 404,
                message: "The password doesn't match users password.",
            });
        }

        if (user) {
            user.password = newPassword;
            user.save();
        }

        return res.status(200).json({
            message: 'Password updated successfully.',
        });
    } catch (error: any) {
        return next({
            statusCode: 500,
            message: error.message,
        });
    }
});

router.post('/logout', (req, res, next) => {
    try {
        res.cookie('jwt', 'loggedout', {
            expires: new Date(Date.now() + 1000),
            httpOnly: true,
        });

        return res.status(200).json({
            message: 'Logged out successfully.',
        });
    } catch (error: any) {
        return next({
            statusCode: 500,
            message: error.message,
        });
    }
});

export { router as userRouter };

// TODO: some references for later to go through
// Could storage: https://cloud.google.com/storage/docs/how-to
// Nodejs streams: https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93/
// Cloud storage Nodejs client: https://googleapis.dev/nodejs/storage/latest/
