import { Router } from 'express';
// import { Types } from 'mongoose';
import { Homey } from '../models/homeyModel';
import { authMiddelware } from './userRoutes';

export const homeyRouter = Router();

homeyRouter.use(authMiddelware);

homeyRouter.post('/create', async (req, res, next) => {
    try {
        const { name }: { name: string } = req.body;
        // req.user should have the current user data
        const currentUser = req.user;
        if (currentUser) {
            console.log(currentUser.household);
            if (currentUser.household) {
                return next({
                    statusCode: 400,
                    message: 'A user can be member one household at a time.',
                });
            }
            // try to create the household if the name is used throw reject the request
            const household = await Homey.create({
                name,
                members: [currentUser._id],
            });

            currentUser.household = {
                householdRef: household._id,
                joined: new Date(),
                role: 'owner',
            };

            const updatedUser = await currentUser.save();
            return res.status(201).json({
                data: {
                    user: updatedUser,
                    household,
                },
            });
        }
    } catch (error: any) {
        return next({
            statusCode: 500,
            error: error.message,
        });
    }
});
