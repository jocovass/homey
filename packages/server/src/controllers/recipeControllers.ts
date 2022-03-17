import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

import { Household } from '../models/householdModel';
import { Recipe, IRecipe } from '../models/recipeModel';
import { deletePhoto } from '../services/cloudinary';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';

interface GetRecipesQueryPS {
    page?: number;
    perPage?: number;
    tags?: string;
    search?: string;
}
export const getRecipes = catchAsync(
    async (
        req: Request<
            undefined,
            { data: { recipes: IRecipe[] } },
            { householdId: Types.ObjectId },
            GetRecipesQueryPS
        >,
        res: Response,
        next: NextFunction,
    ) => {
        const { householdId } = req.body;
        const { page = 1, perPage = 20, tags, search } = req.query;

        if (!householdId) {
            return next(new AppError('Must provide householdId.', 400));
        }

        const filters: {
            tags?: { $in: string[] };
            $text?: { $search: string };
        } = {};
        if (tags) filters.tags = { $in: [...tags.split(',')] };
        if (search) filters['$text'] = { $search: search };

        const recipes = await Recipe.find({
            householdRef: householdId,
            ...filters,
        })
            .skip(perPage * (page - 1))
            .limit(perPage);

        res.status(200).json({
            data: {
                recipes,
            },
        });
    },
);

interface CreateRecipe extends IRecipe {
    householdId: Types.ObjectId;
}
export const createRecipe = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
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

        res.status(201).json({
            data: {
                recipe,
                household,
            },
        });
    },
);

export const updateRecipe = catchAsync(
    async (
        req: Request<{ recipeId: string }, Promise<void>, IRecipe>,
        res: Response,
        next: NextFunction,
    ) => {
        const { title, tags, ingredients, url, instructions, note } = req.body;
        const { recipeId } = req.params;

        if (!recipeId) {
            return next(new AppError('Must provide recipeId', 400));
        }

        const recipe = await Recipe.findByIdAndUpdate(
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

        res.status(200).json({
            data: {
                recipe,
            },
        });
    },
);

export const updateRecipeCooked = catchAsync(
    async (
        req: Request<{ recipeId: string }, Promise<void>, { cooked: number }>,
        res: Response,
        next: NextFunction,
    ) => {
        const { recipeId } = req.params;
        const { cooked } = req.body;

        if (!recipeId) {
            return next(new AppError('Must provide recipeId', 400));
        }

        const recipe = await Recipe.findByIdAndUpdate(
            recipeId,
            {
                cooked,
            },
            { new: true },
        );

        res.status(200).json({
            data: {
                recipe,
            },
        });
    },
);

export const updateRecipePhoto = catchAsync(
    async (
        req: Request<{ recipeId: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        const { file } = req;
        const { recipeId } = req.params;

        if (!file || !recipeId) {
            return next(
                new AppError('Photo and recipeId must be provided.', 400),
            );
        }

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return next(
                new AppError(
                    "This recipe doesn't exist, or it was deleted.",
                    404,
                ),
            );
        }

        const prevPhoto = recipe.photo;
        recipe.photo = file.filename;
        await recipe.save();

        if (prevPhoto) {
            deletePhoto(prevPhoto);
        }

        res.status(200).json({
            data: {
                recipe,
            },
        });
    },
);

export const deleteRecipePhoto = catchAsync(
    async (
        req: Request<{ recipeId: string }, Promise<void>, { filename: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        const { recipeId } = req.params;
        const { filename } = req.body;

        await deletePhoto(filename);
        await Recipe.findByIdAndUpdate(recipeId, {
            photo: undefined,
        });

        res.status(204).json({
            message: 'Photo deleted successfully.',
        });
    },
);

export const deleteRecipe = catchAsync(
    async (
        req: Request<{ recipeId: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        const { recipeId } = req.params;
        await Recipe.findByIdAndDelete(recipeId);

        res.status(204).json({
            message: 'Recipe deleted successfully.',
        });
    },
);

export const updatePopularRecipes = catchAsync(
    async (
        req: Request<undefined, Promise<void>, { householdId: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        const { householdId } = req.body;
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

        res.status(200).json({ data: { household } });
    },
);
