import { Schema, model, Types } from 'mongoose';

export interface IIngredient {
    label: string;
    amount: number;
    unit: string;
}

export interface IRecipe {
    title: string;
    householdRef: Types.ObjectId;
    createdBy: string;
    ingredients: IIngredient[];
    url: string;
    coocked?: number;
    photo?: string;
    instructions?: {
        text: string;
        nodeType: string;
    }[];
    note?: string;
    tags?: string[];
}

const recipeSchema = new Schema<IRecipe>(
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
        instructions: [
            {
                text: String,
                nodeType: String,
            },
        ],
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

recipeSchema.index({ '$**': 'text' });

export const Recipe = model<IRecipe>('Recipe', recipeSchema);
