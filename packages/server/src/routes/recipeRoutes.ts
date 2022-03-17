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

export const recipeRouter = Router();

recipeRouter.use(authMiddelware);

recipeRouter.get('/', getRecipes);
recipeRouter.post('/create', createRecipe);
recipeRouter.patch('/update/:recipeId', updateRecipe);
recipeRouter.patch('/:recipeId/update_cooked', updateRecipeCooked);
recipeRouter.patch(
    '/:recipeId/update_photo',
    singlePhoto('recipes', 'photo'),
    updateRecipePhoto,
);
recipeRouter.delete('/:recipeId/delete_photo', deleteRecipePhoto);
recipeRouter.delete('/:recipeId/delete', deleteRecipe);
recipeRouter.post('/update_popular_recipes', updatePopularRecipes);
