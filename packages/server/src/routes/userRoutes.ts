import express, { Request, Response, NextFunction } from 'express';

// create a subrouter on /api/v1/users
const router = express.Router();

type SignupProps = {
    name: string;
    email: string;
    password: string;
};

router.post('/signup', (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password }: SignupProps = req.body;

        console.log(name, email, password);

        res.status(201).json({
            message: 'Successfull. User account was created.',
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Bad request' });
    }
});

export { router as userRouter };
