import { Request } from 'express';
import multer from 'multer';
import path from 'path';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const uploader = (filePrefix: string, folderName?: string) => {
    const defaultDir = path.join(__dirname, '../../public');

    const storage = multer.diskStorage({
        destination: (
            req: Request,
            file: Express.Multer.File,
            cb: DestinationCallback
        ) => {
            const destination = folderName ? path.join(defaultDir, folderName) : defaultDir;
            cb(null, destination);
        },
        filename: (
            req: Request,
            file: Express.Multer.File,
            cb: FileNameCallback
        ) => {
            const originalNameParts = file.originalname.split('.');
            const fileExtension = originalNameParts[originalNameParts.length - 1];
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const newFileName = `${filePrefix}-${uniqueSuffix}.${fileExtension}`;
            cb(null, newFileName);
        }
    });

    return multer({ storage: storage });
};
