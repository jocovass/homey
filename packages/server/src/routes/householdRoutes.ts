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
import { simpleField, validate, checkParams } from '../utils/validators';

export const householdRouter = Router();

householdRouter.use(authMiddelware);

householdRouter.post('/create', simpleField('name'), validate, createHousehold);
householdRouter.get(
    '/:householdId',
    checkParams('householdId'),
    validate,
    getHousehold,
);
householdRouter.post(
    '/:householdId/shoppinglist/create',
    checkParams('householdId'),
    simpleField('title'),
    validate,
    createShoppingList,
);
householdRouter.post(
    '/:householdId/shoppinglist/:shoppinglistId/add',
    checkParams(['householdId', 'shoppinglistId']),
    simpleField('label'),
    validate,
    addShoppingListItem,
);
householdRouter.delete(
    '/:householdId/shoppinglist/:shoppinglistId/remove/:listId',
    checkParams(['householdId', 'shoppinglistId', 'listId']),
    validate,
    deleteShoppingListItem,
);
householdRouter.delete(
    '/:householdId/shoppinglist/:shoppinglistId',
    checkParams(['householdId', 'shoppinglistId']),
    validate,
    deleteShoppingList,
);
