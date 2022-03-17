import express from 'express';
import { singlePhoto } from '../services/cloudinary';
import {
    singup,
    login,
    resetPassword,
    authMiddelware,
    logout,
} from '../controllers/authControlles';
import {
    updatePassword,
    updateProfile,
    updateProfileImage,
} from '../controllers/userController';

const router = express.Router();

// TODO: validation middleware
// TODO: signupwithinvitation

router.post('/signup', singup);
router.post('/login', login);
router.post('/forget_my_password');
router.post('/reset_password/:resetToken', resetPassword);

// isAuthenticated middleware
router.use(authMiddelware);

router.post('/update_profile', updateProfile);
router.post(
    '/update_profile_image',
    singlePhoto('users_profile', 'avatar'),
    updateProfileImage,
);
router.post('/update_password', updatePassword);
router.post('/logout', logout);

export { router as userRouter };

// TODO: some references for later to go through
// Could storage: https://cloud.google.com/storage/docs/how-to
// Nodejs streams: https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93/
// Cloud storage Nodejs client: https://googleapis.dev/nodejs/storage/latest/
