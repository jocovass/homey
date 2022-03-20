import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { userRouter } from './routes/userRoutes';
import { householdRouter } from './routes/householdRoutes';
import { recipeRouter } from './routes/recipeRoutes';
import { errorController } from './controllers/errorController';
import { AppError } from './utils/appError';

const app = express();

// Cross Origin Resource Sharing
// HTTP header based mechanism, allows a server to indicate any origins other than its own from which a browser should permit loading resources
app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use(cookieParser());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/households', householdRouter);
app.use('/api/v1/recipes', recipeRouter);

// Catch any unhandled routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    return next(
        new AppError(`${req.originalUrl} endpoint doesn't exists.`, 400),
    );
});

// Global error handler
app.use(errorController);

export { app };
