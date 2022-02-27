import { Router } from 'express';
import { Household } from '../models/householdModel';
import { authMiddelware } from './userRoutes';
import { ShoppingListItem } from '../models/householdModel';

export const householdRouter = Router();

householdRouter.use(authMiddelware);

householdRouter.post('/create', async (req, res, next) => {
    try {
        const { name }: { name: string } = req.body;
        // req.user should have the current user data
        const currentUser = req.user;
        if (currentUser) {
            if (currentUser.household?.householdRef) {
                return next({
                    statusCode: 400,
                    message: 'A user can be member one household at a time.',
                });
            }
            // try to create the household if the name is used throw reject the request
            const household = await Household.create({
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

householdRouter.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const household = await Household.findById(id).populate({
            path: 'members',
            match: { _id: { $ne: req.user?._id } },
        });

        return res.status(200).json({
            data: {
                household,
            },
        });
    } catch (error: any) {
        return next({
            statusCode: 500,
            message: error.message,
        });
    }
});

householdRouter.post(
    '/:householdId/shoppinglist/create',
    async (req, res, next) => {
        try {
            const { title } = req.body;
            const { householdId } = req.params;
            const household = await Household.findByIdAndUpdate(
                householdId,
                { $push: { shoppingList: { title } } },
                {
                    new: true,
                },
            );
            return res.status(201).json({
                data: {
                    household,
                },
            });
        } catch (error: any) {
            return next({
                statusCode: 500,
                message: error.message,
            });
        }
    },
);

householdRouter.post(
    '/:householdId/shoppinglist/:shoppinglistId/add',
    async (req, res, next) => {
        try {
            const { label, amount, unit }: ShoppingListItem = req.body;
            const { householdId, shoppinglistId } = req.params;
            const household = await Household.findOneAndUpdate(
                {
                    _id: householdId,
                    shoppingList: { $elemMatch: { _id: shoppinglistId } },
                },
                {
                    $push: {
                        'shoppingList.$.list': {
                            label,
                            amount,
                            unit,
                        },
                    },
                },
                {
                    new: true,
                },
            );

            return res.status(201).json({
                data: {
                    household,
                },
            });
        } catch (error: any) {
            return next({
                statusCode: 500,
                message: error.message,
            });
        }
    },
);

householdRouter.delete(
    '/:householdId/shoppinglist/:shoppinglistId/remove/:listId',
    async (req, res, next) => {
        try {
            const { householdId, shoppinglistId, listId } = req.params;
            const household = await Household.findOneAndUpdate(
                {
                    _id: householdId,
                    shoppingList: { $elemMatch: { _id: shoppinglistId } },
                },
                {
                    $pull: {
                        'shoppingList.$.list': {
                            _id: listId,
                        },
                    },
                },
                {
                    new: true,
                },
            );

            return res.status(204).json({
                data: {
                    household,
                },
            });
        } catch (error: any) {
            return next({
                statusCode: 500,
                message: error.message,
            });
        }
    },
);

householdRouter.delete(
    '/:householdId/shoppinglist/:shoppinglistId',
    async (req, res, next) => {
        try {
            const { householdId, shoppinglistId } = req.params;
            const household = await Household.findByIdAndUpdate(
                householdId,
                { $pull: { shoppingList: { _id: shoppinglistId } } },
                {
                    new: true,
                },
            );
            return res.status(204).json({
                data: {
                    household,
                },
            });
        } catch (error: any) {
            return next({
                statusCode: 500,
                message: error.message,
            });
        }
    },
);
