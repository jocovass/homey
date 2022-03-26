import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import { User } from '../models/userModel';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { deletePhoto } from '../services/cloudinary';
import { sendInvitationEmail } from '../services/email';

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
                    'To update the password please use the /update_password endpoint.',
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
        const { password, newPassword } = req.body;
        const userWithoutPassword = req.user;
        if (!userWithoutPassword) {
            return next(new AppError('Unauthorized!', 401));
        }
        const user = await User.findById(userWithoutPassword._id).select(
            '+password',
        );

        // check if the user password matches the given password
        if (
            (user && !(await user.comparePassword(user.password, password))) ||
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

export const sendInvitation = catchAsync(
    async (
        req: Request<
            undefined,
            Promise<void>,
            {
                email: string;
                householdId: Types.ObjectId;
                householdName: string;
            }
        >,
        res: Response,
        next: NextFunction,
    ) => {
        const currentUser = req.user;
        const { email, householdId, householdName } = req.body;

        // find user with email and update invitations
        const user = await User.findOneAndUpdate(
            { email },
            {
                $push: {
                    invitations: {
                        household: householdId,
                        invitedBy: currentUser?._id,
                        status: 'pending',
                    },
                },
            },
            {
                new: true,
            },
        );

        // if user doesn't exit send and invitation to sign up
        if (!user) {
            if (!currentUser) {
                return next(new AppError('Unauthorized operation.', 401));
            }

            const url = `${req.protocol}://${req.get(
                'host',
            )}/api/v1/users/signup_with_invitation/${householdId}`;
            console.log('emalto', email);
            console.log('emailfrom', currentUser.email);
            await sendInvitationEmail({
                emailTo: email,
                emailFrom: currentUser.email,
                nameFrom: `${currentUser.firstName} ${currentUser.lastName}`,
                householdName,
                url,
            });
        }

        res.status(200).json({
            message: 'Invitation was successful',
        });
    },
);
