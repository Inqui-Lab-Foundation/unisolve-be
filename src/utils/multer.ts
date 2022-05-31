import { Request } from "express";
import multer from "multer";

const imageFilter = (req: Request, file: any, cb: any) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
};

var storage = multer.diskStorage({
    destination: (req: Request, file: any, cb: any) => {
        cb(null, __dirname + "../../../resources/static/assets/uploads/courses");
    },
    filename: (req: Request, file: any, cb: any) => {
        cb(null, `${Date.now()}-unisolve-${file.originalname}`);
    },
});

const uploadFile = multer({ storage: storage, fileFilter: imageFilter });

export default uploadFile;