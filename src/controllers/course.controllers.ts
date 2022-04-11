import { Request, Response } from "express";

import courseServices from "../services/course.services";
import { coursePayloadInput } from "../schemas/course.schema";
import { course } from "../models/course.model";
import logger from '../utils/logger'
/**
 * Controller class for all  courser API's 
 */
class courseController {
    async createCourse(req: Request<{}, {}, coursePayloadInput["body"]>, res: Response) {
        const product = await courseServices.buildCourse(req.body);
        if (!product) {
            logger.error(`error create a course`)
            return res.status(406).send({ message: 'error create a course' });
        }
        return res.send(product)
    }
    async getCourses(req: Request<{}, {}>, res: Response) {
        const courses = await courseServices.findCourses();
        if (!courses) {
            logger.error(`courses not found`)
            return res.status(406).send({ message: 'courses not found' });
        }
        logger.info(`courses found ${JSON.stringify(courses)}`)
        return res.send({ courses });
    }
    async getCourseById(req: Request, res: Response) {
        const course_id = req.params.courseId;
        const product = await courseServices.findCourse(course_id)
        if (!product) {
            logger.error(`course not found}`)
            return res.status(406).send({ message: 'course not found' });
        }
        logger.info(`course found`)
        return res.send({ product });
    }
    async updateCourse(req: Request, res: Response) {
        const course_id = req.params.courseId;
        const update = req.body;
        const entry = await courseServices.findCourse(course_id);
        if (!entry) {
            logger.error(`Product not found}`)
            return res.status(406).send({ message: 'product not found' });
        }
        const updatedCourse = await courseServices.updateCourse(update, course_id);
        logger.info(`Product update ${JSON.stringify(updatedCourse)}`)
        return res.send(updatedCourse);
    };
    async deleteCourse(req: Request, res: Response) {
        const course_id = req.params.courseId;
        const entry = await courseServices.findCourse(course_id);
        if (!entry) {
            logger.error(`Product not found}`)
            return res.status(406).send({ message: 'product not found' });
        }
        const deleteCourse = await courseServices.destroyCourse(course_id);
        logger.info(`Product delete}`)
        return res.send({ deleteCourse, text: 'successfully delete the entry' })
    }
}

export default new courseController();