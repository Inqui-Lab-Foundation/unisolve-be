import { Request } from "express";
import multer from "multer";
import path from "path";

const imageFilter = (req: Request, file: any, cb: any) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
};

var storage = multer.diskStorage({
    destination: (req: Request, file: any, cb: any) => {
        cb(null, path.join(process.cwd(), 'resources/static/uploads'));
    },
    filename: (req: Request, file: any, cb: any) => {
        cb(null, `${file.originalname}`);
    },
});

const uploadFile = multer({ storage: storage, fileFilter: imageFilter });

export default uploadFile;