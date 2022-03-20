import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { CastError } from 'mongoose';

import { AppError } from '../utils/appError';

const handleCastErrorDB = (err: CastError) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err: any) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
    const message = `Duplicate field value: ${value[0]}. Please use another value.`;

    return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () =>
    new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
    new AppError('Your token is expired. Please log in again!', 401);

const sendErrorDev = (err: any, req: Request, res: Response) => {
    //API
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err,
    });
};

const sendErrorProd = (err: any, req: Request, res: Response) => {
    if (err.isOperational) {
        // Operational trusted error: send message to client
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    // Programming or other error unknown error: don't leak error details
    // 1. Log error
    console.error('ERROR 💥', err);
    // 2. Send generic message to the client
    return res.status(500).json({
        status: 'error',
        message: 'Somthing went wrong!',
    });
};

export const errorController: ErrorRequestHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 1100) error = handleDuplicateFieldDB(error);
        if (error.name === 'ValidationError') handleValidationErrorDB(error);
        if (error.name === 'JsonWebtokenError') handleJWTError();
        if (error.name === 'TokenExpiredError') handleJWTExpiredError();
        sendErrorProd(error, req, res);
    }
};
