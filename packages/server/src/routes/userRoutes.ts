import express from 'express';
import { singlePhoto } from '../services/cloudinary';
import {
    singup,
    signUpWithInvitation,
    login,
    resetPassword,
    authMiddelware,
    logout,
    forgetPossword,
} from '../controllers/authControlles';
import {
    acceptInvitation,
    leaveHousehold,
    rejectInvitation,
    sendInvitation,
    updatePassword,
    updateProfile,
    updateProfileImage,
} from '../controllers/userController';
import {
    validate,
    simpleField,
    email,
    password,
    comparePassword,
    checkParams,
} from '../utils/validators';

const router = express.Router();

router.post(
    '/signup',
    simpleField(['firstName', 'lastName']),
    email(),
    password(),
    comparePassword(),
    validate,
    singup,
);
router.post(
    '/signup_with_invitation/:householdId',
    email(),
    password(),
    comparePassword(),
    checkParams('householdId'),
    validate,
    signUpWithInvitation,
);
router.post('/login', email(), password(), validate, login);
router.post('/forget_my_password', email(), validate, forgetPossword);
router.post(
    '/reset_password/:resetToken',
    password(),
    checkParams('resetToken'),
    validate,
    resetPassword,
);

// isAuthenticated middleware
router.use(authMiddelware);

router.post(
    '/send_invitation',
    simpleField(['householdName, householdId', 'email']),
    validate,
    sendInvitation,
);
router.post(
    '/accept_invitation',
    simpleField(['householdId', 'invitationId']),
    validate,
    acceptInvitation,
);
router.post(
    '/reject_invitation',
    simpleField('invitationId'),
    validate,
    rejectInvitation,
);
router.post(
    '/leave_household',
    simpleField('householdId'),
    validate,
    leaveHousehold,
);
router.post(
    '/update_profile',
    email(),
    simpleField(['firstName', 'lastName']),
    validate,
    updateProfile,
);
router.post(
    '/update_profile_image',
    singlePhoto('users_profile', 'avatar'),
    updateProfileImage,
);
router.post(
    '/update_password',
    password(['password', 'newPassword']),
    comparePassword('newPassword', 'newPasswordConfirm'),
    validate,
    updatePassword,
);
router.post('/logout', logout);

export { router as userRouter };

// TODO: some references for later to go through
// Could storage: https://cloud.google.com/storage/docs/how-to
// Nodejs streams: https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93/
// Cloud storage Nodejs client: https://googleapis.dev/nodejs/storage/latest/
