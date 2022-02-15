import express, { Request, Response, NextFunction } from 'express';
import { User, IUserFront } from '../models/userModel';

// create a subrouter on /api/v1/users
const router = express.Router();

type SignupProps = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

// lgoin
// logout
// updateprofile
// updateimage
// singup
// signupwithinvitation
// resetpassword

router.post(
    '/signup',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { firstName, lastName, email, password }: SignupProps =
                req.body;

            const user: IUserFront & { password: string | undefined } =
                await User.create({
                    email,
                    firstName,
                    lastName,
                    password,
                });

            user.password = undefined;

            res.status(201).json({
                message: 'Successfull. User account was created.',
                data: user,
            });
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
            const user: IUserFront | null = await User.findOne({ email });

            if (!user) {
                return next({
                    statusCode: 401,
                    message: 'Unauhtorized.',
                });
            }

            return res.status(200).json({
                message: 'Login was successful.',
                data: user,
            });
        } catch (error) {
            return next({
                statusCode: 401,
                message: 'Unauhtorized.',
            });
        }
    },
);

export { router as userRouter };
