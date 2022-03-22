import { Router } from 'express';
import { authMiddelware } from '../controllers/authControlles';
import { singlePhoto } from '../services/cloudinary';
import {
    createRecipe,
    deleteRecipe,
    deleteRecipePhoto,
    getRecipes,
    updatePopularRecipes,
    updateRecipe,
    updateRecipeCooked,
    updateRecipePhoto,
} from '../controllers/recipeControllers';
import { validate, checkParams, simpleField } from '../utils/validators';

export const recipeRouter = Router();

recipeRouter.use(authMiddelware);

recipeRouter.get('/', checkParams('householdId'), validate, getRecipes);
recipeRouter.post(
    '/create',
    checkParams('householdId'),
    validate,
    createRecipe,
);
recipeRouter.patch(
    '/update/:recipeId',
    checkParams('recipeId'),
    validate,
    updateRecipe,
);
recipeRouter.patch(
    '/:recipeId/update_cooked',
    checkParams('recipeId'),
    validate,
    updateRecipeCooked,
);
recipeRouter.patch(
    '/:recipeId/update_photo',
    checkParams('recipeId'),
    validate,
    singlePhoto('recipes', 'photo'),
    updateRecipePhoto,
);
recipeRouter.delete(
    '/:recipeId/delete_photo',
    checkParams('recipeId'),
    simpleField('filename'),
    validate,
    deleteRecipePhoto,
);
recipeRouter.delete(
    '/:recipeId/delete',
    checkParams('recipeId'),
    validate,
    deleteRecipe,
);
recipeRouter.post(
    '/update_popular_recipes',
    simpleField('householdId'),
    validate,
    updatePopularRecipes,
);
