import { Schema, Types, model } from 'mongoose';

interface ShoppingListItem {
    label: string;
    amount: number;
    unit: string;
    status: 'pending' | 'done';
}

interface IHomey {
    name: string;
    shoppingList: ShoppingListItem[];
    members: [{ type: Types.ObjectId; ref: string }];
    recepies: [{ type: Types.ObjectId; ref: string }];
    finances: [{ type: Types.ObjectId; ref: string }];
}

const homeySchema = new Schema<IHomey>(
    {
        name: {
            type: String,
            unique: true,
            required: [true, 'Name field is required.'],
        },
        shoppingList: {
            type: [
                {
                    label: String,
                    amount: Number,
                    unit: String,
                    status: {
                        type: String,
                        enum: ['pending', 'done'],
                    },
                },
            ],
        },
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        recepies: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Recepie',
            },
        ],
        finances: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Finance',
            },
        ],
    },
    {
        timestamps: true,
    },
);

export const Homey = model<IHomey>('Homey', homeySchema);
