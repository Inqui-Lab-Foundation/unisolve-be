import { Router } from "express";
import validate from "../../middleware/validateResource";
import { videoPayload,videoUpdate } from "../../payloadSchema/video.schema";
import videoControllers from "../../controllers/video.controllers";

const router = Router();

router.post('/create', validate(videoPayload), videoControllers.createHandler);
router.get('/list', videoControllers.getHandler);
router.get('/get/:videoId', videoControllers.getByIdHandler);
router.put('/update/:videoId', validate(videoUpdate), videoControllers.updateHandler);
router.delete('/delete/:videoId', videoControllers.deleteHandler);

export default router;