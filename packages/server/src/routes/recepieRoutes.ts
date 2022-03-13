import { Router, Request } from 'express';
import { Types } from 'mongoose';
import { Household } from '../models/householdModel';
import { Recepie, IRecepie } from '../models/recepieModel';
import { authMiddelware } from './userRoutes';

export const recepieRouter = Router();

recepieRouter.use(authMiddelware);

interface CreateRecepeie extends IRecepie {
    householdId: Types.ObjectId;
}

// update

interface GetRecepiesQueryPS {
    page?: number;
    perPage?: number;
    tags?: string;
    search?: string;
}

recepieRouter.get(
    '/',
    async (
        req: Request<
            undefined,
            { data: { recepies: IRecepie[] } },
            { householdId: Types.ObjectId },
            GetRecepiesQueryPS
        >,
        res,
        next,
    ) => {
        try {
            const { householdId } = req.body;
            const { page = 1, perPage = 20, tags, search } = req.query;

            if (!householdId) {
                return next({
                    statusCode: 400,
                    message: 'Must provide householdId.',
                });
            }

            const filters: {
                tags?: { $in: string[] };
                $text?: { $search: string };
            } = {};
            if (tags) filters.tags = { $in: [...tags.split(',')] };
            if (search) filters['$text'] = { $search: search };

            const results = await Recepie.find({
                householdRef: householdId,
                ...filters,
            })
                .skip(perPage * (page - 1))
                .limit(perPage);

            return res.status(200).json({
                data: {
                    recepies: results,
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

recepieRouter.post('/create', async (req, res, next) => {
    try {
        const { householdId, ...rest }: CreateRecepeie = req.body;
        const recepie = await Recepie.create({
            ...rest,
            householdRef: householdId,
        });

        const household = await Household.findByIdAndUpdate(
            householdId,
            {
                $inc: { 'recepies.total': 1 },
            },
            { new: true },
        );

        return res.status(201).json({
            data: {
                recepie,
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

recepieRouter.patch('/update/:recepieId', async (req, res, next) => {
    try {
        const { title, tags, ingredients, url, instructions, note }: IRecepie =
            req.body;
        const { recepieId } = req.params;

        if (!recepieId) {
            return next({
                statusCode: 400,
                message: 'Must provide recepieId',
            });
        }

        const result = await Recepie.findByIdAndUpdate(
            recepieId,
            {
                title,
                url,
                note,
                tags,
                ingredients,
                instructions,
            },
            {
                new: true,
            },
        );

        return res.status(200).json({
            data: result,
        });
    } catch (error: any) {
        return next({
            statusCode: 500,
            message: error.message,
        });
    }
});

recepieRouter.delete('/delete/:recepieId', async (req, res, next) => {
    try {
        const { recepieId } = req.params;
        await Recepie.findByIdAndDelete(recepieId);

        return res.status(204).json({});
    } catch (error: any) {
        return next({
            statusCode: 500,
            message: error.message,
        });
    }
});

recepieRouter.post('/update_popular_recepies', async (req, res, next) => {
    try {
        const { householdId }: { householdId: Types.ObjectId } = req.body;
        const queries: any[] = [];

        queries.push(
            Recepie.find({ householdRef: householdId })
                .sort('-coocked')
                .limit(2)
                .exec(),
        );

        queries.push(
            Household.findById(householdId).populate('recepies.latest').exec(),
        );

        const [recepies, household] = await Promise.all(queries);

        // if we have recepies we want to update the two most popular recepies in the
        // household document
        if (Array.isArray(recepies) && recepies.length) {
            const popularRecepies = [];
            if (household.recepies.latest.length) {
                while (
                    recepies.length &&
                    household.recepies.latest.length &&
                    popularRecepies.length < 2
                ) {
                    if (
                        String(recepies[0]._id) ===
                        String(household.recepies.latest[0]._id)
                    ) {
                        popularRecepies.push(recepies.shift());
                        household.recepies.latest.shift();
                    } else if (
                        recepies[0].coocked >=
                        household.recepies.latest[0].coocked
                    ) {
                        popularRecepies.push(recepies.shift());
                    } else {
                        popularRecepies.push(household.recepies.latest.shift());
                    }
                }

                if (popularRecepies.length < 2 && recepies.length) {
                    popularRecepies.push(...recepies);
                }
            } else {
                popularRecepies.push(...recepies);
            }

            household.recepies.latest = popularRecepies;
            await household.save();
        }

        return res.status(200).json({ data: { household } });
    } catch (error: any) {
        return next({
            statusCode: 500,
            message: error.message,
        });
    }
});
