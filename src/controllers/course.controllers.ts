import { Request, Response } from "express";
import operationalServices from "../services/operational.services";
import { course } from "../models/course.model";
import logger from '../utils/logger'
import storeLogsToDatabase from "../services/databaseLogger.service";
class CourseController {
    async createHandler(req: Request, res: Response) {
        const product = await operationalServices.build(course, req.body);
        if (!product) {
            logger.error(`Something went wrong while creating the course  ${JSON.stringify(req.body)}`);
            storeLogsToDatabase(req, product, 'failed');
            return res.status(406).json({ message: 'Something went wrong. Please check the payload' });
        }
        logger.error(`Course created ${JSON.stringify(product)}`);
        storeLogsToDatabase(req, product, 'success');
        return res.status(201).json(product)
    }
    async getHandler(req: Request, res: Response) {
        const products = await operationalServices.findsAll(course);
        if (!products) {
            logger.error(`Can not find the entry Please try again`);
            storeLogsToDatabase(req, products, 'failed');
            return res.status(406).json({ message: 'Can not find the entry Please try again' });
        }
        logger.info(`Entry: ${JSON.stringify(products)}`);
        storeLogsToDatabase(req, products, 'success');
        return res.status(200).json({ products });
    }
    async getByIdHandler(req: Request, res: Response) {
        const request_id = req.params.courseId;
        const product = await operationalServices.findOne(course, { where: { id: request_id } });
        if (!product) {
            logger.error(`Can not find the entry Please try again`);
            storeLogsToDatabase(req, product, 'failed');
            return res.status(406).json({ message: 'Can not find the entry Please try again' });
        }
        storeLogsToDatabase(req, product, 'success');
        logger.info(`Entry Found`)
        return res.status(200).json({ product });
    }
    async updateHandler(req: Request, res: Response) {
        const request_id = req.params.courseId;
        const updateObject = req.body;
        const product = await operationalServices.findOne(course, { where: { id: request_id } });
        if (!product) {
            logger.error(`Can not find the entry Please try again`);
            storeLogsToDatabase(req, product, 'failed');
            return res.status(406).json({ message: 'Can not find the entry Please try again' });
        }
        const response = await operationalServices.updateOne(course, updateObject, { where: { id: request_id } });
        storeLogsToDatabase(req, response, 'success');
        logger.info(`Product updated ${JSON.stringify(response)}`)
        return res.status(200).json({ response });
    };
    async deleteHandler(req: Request, res: Response) {
        const request_id = req.params.courseId;
        const product = await operationalServices.findOne(course, {
            where: {
                id: request_id
            }
        });
        if (!product) {
            logger.error(`Can not find the entry Please try again`);
            storeLogsToDatabase(req, product, 'failed');
            return res.status(406).json({ message: 'Can not find the entry Please try again' });
        }
        const response = await operationalServices.destroyOne(course, { where: { id: request_id } });
        logger.info(`Product delete}`);
        storeLogsToDatabase(req, response, 'success');
        return res.status(200).json({ deletedCourse: response, text: 'successfully delete the entry' })
    }
}

export default new CourseController();