import { Request, Response, NextFunction } from 'express';

import { User } from '../models/userModel';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { deletePhoto } from '../services/cloudinary';

interface UpdateProfile {
    email?: string;
    firstName?: string;
    lastName: string;
    password?: string;
}

export const updateProfile = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, firstName, lastName, password }: UpdateProfile =
            req.body;

        if (password) {
            return next(
                new AppError(
                    'To update the password please use the /updatePassword endpoint.',
                    404,
                ),
            );
        }

        const user = req.user;
        if (!user) {
            return next(new AppError('Unauhtorized!', 401));
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                email,
                firstName,
                lastName,
            },
            { new: true },
        );

        res.status(200).json({
            data: {
                user: updatedUser,
            },
        });
    },
);

export const updateProfileImage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { file, user } = req;

        if (!file) {
            return next(
                new AppError(
                    'Avatar is missing, did you forget to select an img?',
                    400,
                ),
            );
        }

        if (!user) {
            return next(new AppError('Unauthorized!', 401));
        }

        // check if the user already has avtar cus we want to delete that
        const prevAvatar = user.avatar;
        user.avatar = file.filename;
        user.save();

        if (prevAvatar) {
            // need to delete the old avatar so we don't have too many image in storage
            await deletePhoto(prevAvatar);
        }

        res.status(200).json({
            data: {
                avatar: file,
            },
        });
    },
);

export const updatePassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { currentPassword, newPassword } = req.body;
        const userWithoutPassword = req.user;
        if (!userWithoutPassword) {
            return next(new AppError('Unauthorized!', 401));
        }
        const user = await User.findById(userWithoutPassword._id).select(
            '+password',
        );

        // check if the user password matches the given currentPassword
        if (
            (user &&
                !(await user.comparePassword(
                    user.password,
                    currentPassword,
                ))) ||
            !user
        ) {
            return next(
                new AppError("The password doesn't match users password.", 401),
            );
        }

        user.password = newPassword;
        user.save();

        res.status(200).json({
            message: 'Password updated successfully.',
        });
    },
);
