import { Request, Response } from "express";

import courseServices from "../services/course.services";
import { courserPayloadInput } from "../schemas/course.schema";
import { courses } from "../models/course.model";
import logger from '../utils/logger'
/**
 * Controller class for all  courser API's 
 */
class courseController {
    async createCourse(
        req: Request<{}, {}, courserPayloadInput["body"]>,
        res: Response) {
        const product = await courseServices.buildCourse(req.body);
        if (!product) {
            logger.error(`Product not found}`)
            return res.status(406).send({ message: 'product not found' });
        }
        return res.send(product)
    }
    async getCourse(
        req: Request<{}, {}>,
        res: Response) {
        const product = await courseServices.findCourses();
        if (!product) {
            logger.error(`Product not found}`)
            return res.status(406).send({ message: 'product not found' });
        }
        logger.info(`Product found ${JSON.stringify(product)}`)
        return res.send({ product });
    }
    async getCourseById(
        req: Request,
        res: Response) {
        const courser_id = req.params.courseId;
        const product = await courseServices.findCourse(courser_id)
        if (!product) {
            logger.error(`Product not found}`)
            return res.status(406).send({ message: 'product not found' });
        }
        logger.info(`Product found`)
        return res.send({ product });
    }

    async updateCourse(
        req: Request,
        res: Response
    ) {
        const courser_id = req.params.courseId;
        const update = req.body;
        const entry = await courseServices.findCourse(courser_id);
        if (!entry) {
            logger.error(`Product not found}`)
            return res.status(406).send({ message: 'product not found' });
        }
        const updatedCourse = await courseServices.updateCourse(update, courser_id);
        logger.info(`Product update ${JSON.stringify(updatedCourse)}`)
        return res.send(updatedCourse);
    };

    async deleteCourse(
        req: Request,
        res: Response
    ) {
        const courser_id = req.params.courseId;
        const entry = await courseServices.findCourse(courser_id);
        if (!entry) {
            logger.error(`Product not found}`)
            return res.status(406).send({ message: 'product not found' });
        }
        const deleteCourse = await courseServices.destroyCourse(courser_id);
        logger.info(`Product delete}`)
        return res.send({ deleteCourse, text: 'successfully delete the entry' })
    }
}

export default new courseController();