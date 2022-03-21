import { Request, Response } from "express";

import courseServices from "../services/course.services";
import { courserPayloadInput } from "../schemas/course.schema";
import { courses } from "../models/course.model";

/**
 * Controller class for all  courser API's 
 */
class courseController {
    async createCourse(
        req: Request<{}, {}, courserPayloadInput["body"]>,
        res: Response) {
        const { module, courser_id, statue } = req.body;
        const product = await courseServices.buildCourse({ module, courser_id, statue });
        return res.send(product)
    }
    async getCourse(
        req: Request<{}, {}>,
        res: Response) {
        const product = await courses.findAll()
        if (!product) {
            return res.sendStatus(404);
        }
        return res.send({ product });
    }
    async getCourseById(
        req: Request,
        res: Response) {
        const courser_id = req.params.courseId;
        const product = await courses.findOne({ where: { courser_id } })
        if (!product) {
            return res.sendStatus(404);
        }
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
            return res.sendStatus(404);
        }
        const updatedCourse = await courseServices.updateCourse(update, courser_id);
        return res.send(updatedCourse);
    };

    async deleteCourse(
        req: Request,
        res: Response
    ) {
        const courser_id = req.params.courseId;
        const entry = await courseServices.findCourse(courser_id);
        if (!entry) {
            return res.sendStatus(404);
        }
        const deleteCourse = await courseServices.destroyCourse(courser_id);
        return res.send({deleteCourse, text: 'successfully delete the entry'})
    }
}

export default new courseController();