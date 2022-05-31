import { Router } from "express";
import courseControllers from "../../controllers/course.controllers";
import uploadFile from '../../utils/multer';
import validate from '../../middleware/validateResource';
import { coursePayload, courseUpdate } from '../../payloadSchema/course.schema';

const router = Router();

    router.post('/create', uploadFile.single('Thumbnail'), courseControllers.createHandler);
    router.get('/list', courseControllers.getHandler);
    router.get('/:courseId', courseControllers.getByIdHandler);
    router.put('/update/:courseId', validate(courseUpdate), courseControllers.updateHandler);
    router.delete('/delete/:courseId', courseControllers.deleteHandler);

export default router;