import { Router } from 'express';

import { authMiddelware } from '../controllers/authControlles';
import {
    addShoppingListItem,
    createHousehold,
    createShoppingList,
    deleteShoppingList,
    deleteShoppingListItem,
    getHousehold,
} from '../controllers/householdControllers';

export const householdRouter = Router();

householdRouter.use(authMiddelware);

householdRouter.post('/create', createHousehold);
householdRouter.get('/:id', getHousehold);
householdRouter.post('/:householdId/shoppinglist/create', createShoppingList);
householdRouter.post(
    '/:householdId/shoppinglist/:shoppinglistId/add',
    addShoppingListItem,
);
householdRouter.delete(
    '/:householdId/shoppinglist/:shoppinglistId/remove/:listId',
    deleteShoppingListItem,
);
householdRouter.delete(
    '/:householdId/shoppinglist/:shoppinglistId',
    deleteShoppingList,
);
