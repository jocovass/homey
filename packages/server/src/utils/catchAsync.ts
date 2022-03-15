import { Request, Response, NextFunction } from 'express';

type CbFunction = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<void>;

export const catchAsync = (fn: CbFunction) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await fn(req, res, next);
        } catch (error) {
            return next(error);
        }
    };
};
