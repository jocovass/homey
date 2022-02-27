import { Schema, model, Types } from 'mongoose';

export interface IIngredient {
    label: string;
    amount: number;
    unit: string;
}

export interface IRecepie {
    title: string;
    householdRef: Types.ObjectId;
    createdBy: string;
    ingredients: IIngredient[];
    url: string;
    coocked?: number;
    photo?: string;
    instructions?: string;
    note?: string;
    tags?: string[];
}

const recepieSchema = new Schema<IRecepie>(
    {
        title: String,
        householdRef: {
            type: Schema.Types.ObjectId,
            ref: 'Household',
        },
        photo: String,
        tags: [String],
        createdBy: String,
        coocked: {
            type: Number,
            default: 0,
        },
        note: String,
        url: String,
        instructions: String,
        ingredients: [
            {
                label: String,
                amount: Number,
                unit: String,
            },
        ],
    },
    { timestamps: true },
);

export const Recepie = model<IRecepie>('Recepie', recepieSchema);
