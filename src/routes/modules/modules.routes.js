import Router from 'express';
import moduleControllers from '../../controllers/module.controllers';


const router = Router();

router.post('/create', moduleControllers.createHandler);
router.get('/list', moduleControllers.getHandler);
router.get('/get/:moduleId', moduleControllers.getByIdHandler);
router.put('/update/:moduleId', moduleControllers.updateHandler);
router.delete('/delete/:moduleId', moduleControllers.deleteHandler);

export default router;