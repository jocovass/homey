import { Router } from 'express';
import { Types } from 'mongoose';
import { Household } from '../models/householdModel';
import { Recepie, IRecepie } from '../models/recepieModel';
import { authMiddelware } from './userRoutes';

export const recepieRouter = Router();

recepieRouter.use(authMiddelware);

interface CreateRecepeie extends IRecepie {
    householdId: Types.ObjectId;
}

recepieRouter.post('/create', async (req, res, next) => {
    try {
        const { householdId, ...rest }: CreateRecepeie = req.body;
        console.log('here');
        const recepie = await Recepie.create({
            ...rest,
            householdRef: householdId,
        });

        const household = await Household.findByIdAndUpdate(
            householdId,
            {
                $inc: { 'recepies.total': 1 },
            },
            { new: true },
        );

        return res.status(201).json({
            data: {
                recepie,
                household,
            },
        });
    } catch (error: any) {
        return next({
            statusCode: 500,
            message: error.message,
        });
    }
});

// Schema.findOneAndUpdate(
//     { _id: _id },
//     [{
//       $set: {
//         subColl: {
//           $cond: [
//             { $in: [update.name, "$subColl.name"] },
//             {
//               $map: {
//                 input: "$subColl",
//                 in: {
//                   $cond: [
//                     { $eq: ["$$this.name", update.name] },
//                     { $mergeObjects: ["$$this", update] },
//                     "$$this"
//                   ]
//                 }
//               }
//             },
//             { $concatArrays: ["$subColl", [update]] }
//           ]
//         }
//       }
//     }]
//   )
