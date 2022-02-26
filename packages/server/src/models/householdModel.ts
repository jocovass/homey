import { Schema, Types, model } from 'mongoose';

interface ShoppingListItem {
    label: string;
    amount: number;
    unit: string;
    status: 'pending' | 'done';
}

interface IHousehold {
    name: string;
    shoppingList: [
        {
            title: string;
            list: ShoppingListItem[];
        },
    ];
    members: [{ type: Types.ObjectId; ref: string }];
    recepies: {
        totla: number;
        latest: [{ type: Types.ObjectId; ref: string }];
    };
    finances: {
        total?: number;
        grocieries?: number;
        // some more later
    };
}

const householdSchema = new Schema<IHousehold>(
    {
        name: {
            type: String,
            unique: true,
            required: [true, 'Name field is required.'],
        },
        shoppingList: [
            {
                title: String,
                list: [
                    {
                        label: String,
                        amount: Number,
                        unit: String,
                        status: {
                            type: String,
                            enum: ['done', 'pending'],
                        },
                    },
                ],
            },
        ],
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        recepies: {
            total: {
                type: Number,
                default: 0,
            },
            latest: [{ type: Schema.Types.ObjectId, ref: 'Recepie' }],
        },
        finances: {
            total: {
                type: Number,
                default: 0,
            },
            grocieries: {
                type: Number,
                default: 0,
            },
        },
    },
    {
        timestamps: true,
    },
);

export const Household = model<IHousehold>('Household', householdSchema);
