import { v2 as cloudinary } from 'cloudinary';
import { CSEngine } from '../utils/CSEngine';
import multer from 'multer';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SCRET,
});

export const uploadAvatar = () => {
    const storage = new CSEngine({
        cloudinary,
        options: {
            upload_preset: 'users_profile',
        },
    });

    return multer({
        storage,
    }).single('avatar');
};

export const uploadRecipePhoto = () => {
    const storage = new CSEngine({
        cloudinary,
        options: {
            upload_preset: 'recipes',
        },
    });

    return multer({
        storage,
    }).single('photo');
};

export { cloudinary };
