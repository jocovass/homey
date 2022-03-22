import { Request, Response, NextFunction } from 'express';

import { Household, ShoppingListItem } from '../models/householdModel';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

export const createHousehold = catchAsync(
    async (
        req: Request<undefined, Promise<void>, { name: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        const { name } = req.body;
        const currentUser = req.user;
        if (currentUser) {
            if (currentUser.household?.householdRef) {
                return next(
                    new AppError(
                        'A user can be member of one household at a time.',
                        400,
                    ),
                );
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
            res.status(201).json({
                data: {
                    user: updatedUser,
                    household,
                },
            });
        }
    },
);

export const getHousehold = catchAsync(
    async (
        req: Request<{ householdId: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        const { householdId } = req.params;
        const household = await Household.findById(householdId).populate({
            path: 'members',
            match: { _id: { $ne: req.user?._id } },
        });

        res.status(200).json({
            data: {
                household,
            },
        });
    },
);

export const createShoppingList = catchAsync(
    async (
        req: Request<{ householdId: string }, Promise<void>, { title: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        const { title } = req.body;
        const { householdId } = req.params;
        const household = await Household.findByIdAndUpdate(
            householdId,
            { $push: { shoppingList: { title } } },
            {
                new: true,
            },
        );

        res.status(201).json({
            data: {
                household,
            },
        });
    },
);

export const addShoppingListItem = catchAsync(
    async (
        req: Request<
            { householdId: string; shoppinglistId: string },
            Promise<void>,
            ShoppingListItem
        >,
        res: Response,
        next: NextFunction,
    ) => {
        const { label, amount, unit } = req.body;
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

        res.status(201).json({
            data: {
                household,
            },
        });
    },
);

export const deleteShoppingListItem = catchAsync(
    async (
        req: Request<{
            householdId: string;
            shoppinglistId: string;
            listId: string;
        }>,
        res: Response,
        next: NextFunction,
    ) => {
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

        res.status(204).json({
            data: {
                household,
            },
        });
    },
);

export const deleteShoppingList = catchAsync(
    async (
        req: Request<{ householdId: string; shoppinglistId: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        const { householdId, shoppinglistId } = req.params;
        const household = await Household.findByIdAndUpdate(
            householdId,
            { $pull: { shoppingList: { _id: shoppinglistId } } },
            {
                new: true,
            },
        );
        res.status(204).json({
            data: {
                household,
            },
        });
    },
);
