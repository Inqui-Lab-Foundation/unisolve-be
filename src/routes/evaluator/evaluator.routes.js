import { Router } from "express";
import evaluatorControllers from "../../controllers/evaluator.controllers";
import uploadFile from '../../utils/multer';
import validate from '../../middleware/validateResource';
import { evaluatorPayload, evaluatorUpdate } from '../../payloadSchema/evaluator.schema';

const router = Router();

    router.post('/create', validate(evaluatorPayload), evaluatorControllers.createHandler);
    router.get('/list', evaluatorControllers.getHandler);
    router.get('/get/:evaluatorId', evaluatorControllers.getByIdHandler);
    router.put('/update/:evaluatorId', validate(evaluatorUpdate), evaluatorControllers.updateHandler);
    router.delete('/delete/:evaluatorId', evaluatorControllers.deleteHandler);

export default router;