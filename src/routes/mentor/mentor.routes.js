import Router from 'express';
import { mentorPayload,mentorUpdate } from '../../payloadSchema/mentor.schema';
import mentorControllers from '../../controllers/mentor.controllers';
import validate from '../../middleware/validateResource';

const router = Router();

router.post('/create', validate(mentorPayload), mentorControllers.createHandler);
router.get('/list', mentorControllers.getHandler);
router.get('/get/:mentorId', mentorControllers.getByIdHandler);
router.put('/update/:mentorId', validate(mentorUpdate), mentorControllers.updateHandler);
router.delete('/delete/:mentorId', mentorControllers.deleteHandler)

export default router;