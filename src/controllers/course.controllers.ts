import { Request, Response } from "express";

import operationalServices from "../services/operational.services";
import { course } from "../models/course.model";
import logger from '../utils/logger'
/**
 * Controller class for all  courser API's 
 */
class courseController {
    async createHandler(req: Request, res: Response) {
        const product = await operationalServices.build(course, req.body);
        if (!product) {
            logger.error(`something went wrong while creating the entry please check the payload`);
            return res.status(406).send({ message: 'something went wrong while creating the entry please check the payload' });
        }
        return res.send({ product });
    }
    async getHandler(req: Request, res: Response) {
        const products = await operationalServices.findsAll(course);
        if (!products) {
            logger.error(`Can not find the entry please try again`);
            return res.status(406).send({ message: 'Can not find the entry please try again' });
        }
        logger.info(`Entry: ${JSON.stringify(products)}`);
        return res.send({ products });
    }
    async getByIdHandler(req: Request, res: Response) {
        const request_id = req.params.courseId;
        const product = await operationalServices.findOne(course, {
            where: {
                id: request_id
            }
        });
        if (!product) {
            logger.error(`Can not find the entry please try again`);
            return res.status(406).send({ message: 'Can not find the entry please try again' });
        }
        logger.info(`Entry Found`)
        return res.send({ product });
    }
    async updateHandler(req: Request, res: Response) {
        const request_id = req.params.courseId;
        const updateObject = req.body;
        const product = await operationalServices.findOne(course, {
            where: {
                id: request_id
            }
        });
        if (!product) {
            logger.error(`Can not find the entry please try again`);
            return res.status(406).send({ message: 'Can not find the entry please try again' });
        }
        const response = await operationalServices.updateOne(course, updateObject, {
            where: {
                id: request_id
            }
        });
        logger.info(`Product updated ${JSON.stringify(response)}`)
        return res.send({ response });
    };
    async deleteHandler(req: Request, res: Response) {
        const request_id = req.params.courseId;
        const product = await operationalServices.findOne(course, {
            where: {
                id: request_id
            }
        });
        if (!product) {
            logger.error(`Can not find the entry please try again`);
            return res.status(406).send({ message: 'Can not find the entry please try again' });
        }
        const response = await operationalServices.destroyOne(course, {
            where: {
                id: request_id
            }
        });
        logger.info(`Product delete}`);
        return res.send({ deletedCourse: response, text: 'successfully delete the entry' })
    }
}

export default new courseController();