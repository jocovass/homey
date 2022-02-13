import express from 'express';
import cors from 'cors';

import { userRouter } from './routes/userRoutes';

const app = express();

// Cross Origin Resource Sharing
// HTTP header based mechanism, allows a server to indicate any origins other than its own from which a browser should permit loading resources
app.use(cors());

app.use(express.json());

app.use('/api/v1/users', userRouter);

// Catch any unhandled routes
app.all('*', (req, res, next) => {
    res.status(404).json({ message: `The requested URL doen't exist.` });
});

export { app };
