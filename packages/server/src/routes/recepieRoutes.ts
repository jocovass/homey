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

// getAll
// deleteRecepie
// update

recepieRouter.post('/create', async (req, res, next) => {
    try {
        const { householdId, ...rest }: CreateRecepeie = req.body;
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

recepieRouter.post('/update_popular_recepies', async (req, res, next) => {
    try {
        const { householdId }: { householdId: Types.ObjectId } = req.body;
        const queries: any[] = [];

        queries.push(
            Recepie.find({ householdRef: householdId })
                .sort('-coocked')
                .limit(2)
                .exec(),
        );

        queries.push(
            Household.findById(householdId).populate('recepies.latest').exec(),
        );

        const [recepies, household] = await Promise.all(queries);

        // if we have recepies we want to update the two most popular recepies in the
        // household document
        if (Array.isArray(recepies) && recepies.length) {
            const popularRecepies = [];
            if (household.recepies.latest.length) {
                while (
                    recepies.length &&
                    household.recepies.latest.length &&
                    popularRecepies.length < 2
                ) {
                    if (
                        String(recepies[0]._id) ===
                        String(household.recepies.latest[0]._id)
                    ) {
                        popularRecepies.push(recepies.shift());
                        household.recepies.latest.shift();
                    } else if (
                        recepies[0].coocked >=
                        household.recepies.latest[0].coocked
                    ) {
                        popularRecepies.push(recepies.shift());
                    } else {
                        popularRecepies.push(household.recepies.latest.shift());
                    }
                }

                if (popularRecepies.length < 2 && recepies.length) {
                    popularRecepies.push(...recepies);
                }
            } else {
                popularRecepies.push(...recepies);
            }

            household.recepies.latest = popularRecepies;
            await household.save();
        }

        return res.status(200).json({ data: { household } });
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
