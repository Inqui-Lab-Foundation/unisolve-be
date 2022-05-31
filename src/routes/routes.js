/*Importing the dependencies*/
import { Express,Router } from 'express';
import { videoPayload, videoUpdate } from '../payloadSchema/video.schema';
import { evaluatorPayload, evaluatorUpdate } from '../payloadSchema/evaluator.schema';
import { mentorPayload, mentorUpdate } from '../payloadSchema/mentor.schema';
import { coursePayload, courseUpdate } from '../payloadSchema/course.schema';
import videoControllers from '../controllers/video.controllers';
import evaluatorControllers from '../controllers/evaluator.controllers';
import mentorControllers from '../controllers/mentor.controllers';
import validate from '../middleware/validateResource';
import courseControllers from '../controllers/course.controllers';
import moduleControllers from '../controllers/module.controllers';
import uploadFile from '../utils/multer';
import courseRoutes from './course/course.routes';
import evaluatorRoutes from './evaluator/evaluator.routes';
import videoRoutes from './videos/videos.routes';
import mentorRoutes from './mentor/mentor.routes';
import moduleRoutes from './modules/modules.routes';

    const router = Router();
    //videos
    router.use('/video',videoRoutes);

    //course
    router.use('/course',courseRoutes );

    //modules
    router.use('/modules',moduleRoutes );

    //mentor
    router.use('/mentor',mentorRoutes );
    
    //evaluator
    router.use('/evaluator',evaluatorRoutes );

export default router;