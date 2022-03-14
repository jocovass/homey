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

export const deletePhoto = (filename: string) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(
            filename,
            { invalidate: true },
            (error, result) => {
                if (error) {
                    console.log(
                        `💥 Error while deleting recipe photo from cloudinary`,
                        error,
                    );
                    return reject(error);
                } else if (result) {
                    console.log(
                        `✅ Recipe photo successfully deleted from cloudinary`,
                        result,
                    );
                    return resolve(result);
                }
            },
        );
    });
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
