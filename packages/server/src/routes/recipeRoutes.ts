import { Router, Request } from 'express';
import { Types } from 'mongoose';
import { Household } from '../models/householdModel';
import { Recipe, IRecipe } from '../models/recipeModel';
import { authMiddelware } from './userRoutes';

export const recipeRouter = Router();

recipeRouter.use(authMiddelware);

interface CreateRecipe extends IRecipe {
    householdId: Types.ObjectId;
}

// update

interface GetRecipesQueryPS {
    page?: number;
    perPage?: number;
    tags?: string;
    search?: string;
}

recipeRouter.get(
    '/',
    async (
        req: Request<
            undefined,
            { data: { recipes: IRecipe[] } },
            { householdId: Types.ObjectId },
            GetRecipesQueryPS
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

            const results = await Recipe.find({
                householdRef: householdId,
                ...filters,
            })
                .skip(perPage * (page - 1))
                .limit(perPage);

            return res.status(200).json({
                data: {
                    recipes: results,
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

recipeRouter.post('/create', async (req, res, next) => {
    try {
        const { householdId, ...rest }: CreateRecipe = req.body;
        const recipe = await Recipe.create({
            ...rest,
            householdRef: householdId,
        });

        const household = await Household.findByIdAndUpdate(
            householdId,
            {
                $inc: { 'recipes.total': 1 },
            },
            { new: true },
        );

        return res.status(201).json({
            data: {
                recipe,
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

recipeRouter.patch('/update/:recipeId', async (req, res, next) => {
    try {
        const { title, tags, ingredients, url, instructions, note }: IRecipe =
            req.body;
        const { recipeId } = req.params;

        if (!recipeId) {
            return next({
                statusCode: 400,
                message: 'Must provide recipeId',
            });
        }

        const result = await Recipe.findByIdAndUpdate(
            recipeId,
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

recipeRouter.patch('/update_cooked/:recipeId', async (req, res, next) => {
    try {
        const { recipeId } = req.params;
        const { cooked }: { cooked: number } = req.body;

        if (!recipeId) {
            return next({
                statusCode: 400,
                message: 'Must provide recipeId',
            });
        }

        const result = await Recipe.findByIdAndUpdate(
            recipeId,
            {
                cooked,
            },
            { new: true },
        );

        return res.status(200).json({
            data: {
                recipe: result,
            },
        });
    } catch (error: any) {
        return next({
            statusCode: 500,
            message: error.message,
        });
    }
});

recipeRouter.delete('/delete/:recipeId', async (req, res, next) => {
    try {
        const { recipeId } = req.params;
        await Recipe.findByIdAndDelete(recipeId);

        return res.status(204).json({});
    } catch (error: any) {
        return next({
            statusCode: 500,
            message: error.message,
        });
    }
});

recipeRouter.post('/update_popular_recipes', async (req, res, next) => {
    try {
        const { householdId }: { householdId: Types.ObjectId } = req.body;
        const queries: any[] = [];

        queries.push(
            Recipe.find({ householdRef: householdId })
                .sort('-cooked')
                .limit(2)
                .exec(),
        );

        queries.push(
            Household.findById(householdId)
                .populate('recipes.mostPopular')
                .exec(),
        );

        const [recipes, household] = await Promise.all(queries);

        // if we have recipes we want to update the two most popular recipes in the
        // household document
        if (Array.isArray(recipes) && recipes.length) {
            const popularRecipes = [];
            if (household.recipes.mostPopular.length) {
                while (
                    recipes.length &&
                    household.recipes.mostPopular.length &&
                    popularRecipes.length < 2
                ) {
                    if (
                        String(recipes[0]._id) ===
                        String(household.recipes.mostPopular[0]._id)
                    ) {
                        popularRecipes.push(recipes.shift());
                        household.recipes.mostPopular.shift();
                    } else if (
                        recipes[0].cooked >=
                        household.recipes.mostPopular[0].cooked
                    ) {
                        popularRecipes.push(recipes.shift());
                    } else {
                        popularRecipes.push(
                            household.recipes.mostPopular.shift(),
                        );
                    }
                }

                if (popularRecipes.length < 2 && recipes.length) {
                    popularRecipes.push(...recipes);
                }
            } else {
                popularRecipes.push(...recipes);
            }

            household.recipes.mostPopular = popularRecipes;
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
