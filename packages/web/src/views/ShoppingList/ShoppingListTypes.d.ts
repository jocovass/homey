export type ShoppingListFormFields = {
    label: string;
    amount: number;
    unit: string;
};

export type ShoppingListItem = {
    label: string;
    amount: number;
    unit: string;
    status?: 'pending' | 'done';
    id: number;
};

export type ShoppingListItems = ShoppingListItem[] | null;
