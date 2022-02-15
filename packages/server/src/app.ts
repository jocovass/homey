import express, {
    ErrorRequestHandler,
    Request,
    Response,
    NextFunction,
} from 'express';
import cors from 'cors';

import { userRouter } from './routes/userRoutes';

const app = express();

// Cross Origin Resource Sharing
// HTTP header based mechanism, allows a server to indicate any origins other than its own from which a browser should permit loading resources
app.use(cors());

app.use(express.json());

app.use('/api/v1/users', userRouter);

// Catch any unhandled routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    return next({
        statusCode: 404,
        message: "The requested URL doesn't existsSync.",
    });
});

// Global error handler
const globalErrorHandle: ErrorRequestHandler = (err, req, res, next) => {
    const { statusCode, message } = err;
    res.status(statusCode || 500).json({
        error: {
            message: message || 'Something went wrong.',
        },
    });
};
app.use(globalErrorHandle);

export { app };
