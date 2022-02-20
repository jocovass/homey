import { Request } from 'express';
import {
    UploadApiResponse,
    UploadApiOptions,
    v2 as cloudinary,
} from 'cloudinary';
import { StorageEngine } from 'multer';

type Options = {
    cloudinary: typeof cloudinary;
    options: UploadApiOptions;
};

type File = Express.Multer.File;

// Custome storage engine using the multer as a base
export class CSEngine implements StorageEngine {
    private cloudinary: typeof cloudinary;
    private options: UploadApiOptions;

    constructor(opts: Options) {
        this.cloudinary = opts.cloudinary;
        this.options = opts.options;
    }

    async _handleFile(
        req: Request,
        file: File,
        cb: (error?: any, info?: Partial<File>) => void,
    ): Promise<void> {
        try {
            const resp = await this.upload(this.options, file);

            // if for some resone the we don't get back anything from the upload
            // we assume that the upload has failed
            if (!resp) {
                cb(new Error('Upload failed!.'));
                return;
            }

            cb(null, {
                path: resp.secure_url,
                size: resp.bytes,
                filename: resp.public_id,
            });
        } catch (error: any) {
            cb(error);
        }
    }

    _removeFile(req: Request, file: File, cb: (error: Error) => void): void {
        this.cloudinary.uploader.destroy(
            file.filename,
            { invalidate: true },
            cb,
        );
    }

    private upload(
        opts: UploadApiOptions,
        file: File,
    ): Promise<UploadApiResponse | undefined> {
        return new Promise((resolve, reject) => {
            const stream = this.cloudinary.uploader.upload_stream(
                opts,
                (err, response) => {
                    if (err != null) return reject(err);
                    return resolve(response);
                },
            );

            file.stream.pipe(stream);
        });
    }
}
