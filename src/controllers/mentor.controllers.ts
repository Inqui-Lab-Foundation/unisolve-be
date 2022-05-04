import { Request, Response } from "express";

import operationalServices from "../services/operational.services";
import { mentor } from "../models/mentor.model";
import logger from '../utils/logger'
import { log } from "../models/log";
/**
 * Controller class for all mentor API's 
 */
class mentorController {
    async createHandler(req: Request, res: Response) {
        const product = await operationalServices.build(mentor, req.body);
        if (!product) {
            logger.error(`something went wrong while creating the entry please check the payload`);
            operationalServices.build(log, {
                api_name: req.originalUrl,
                request_method: req.method,
                request: `${JSON.stringify(req.body)}`,
                response: `${JSON.stringify(product)}`,
                status: 'failed'
            });
            return res.status(406).send({ message: 'something went wrong while creating the entry please check the payload' });
        }
        operationalServices.build(log, {
            api_name: req.originalUrl,
            request_method: req.method,
            request: `${JSON.stringify(req.body)}`,
            response: `${JSON.stringify(product)}`,
            status: 'success'
        });
        return res.send({ product });
    }
    async getHandler(req: Request, res: Response) {
        const products = await operationalServices.findsAll(mentor);
        if (!products) {
            logger.error(`Can not find the entry please try again`);
            operationalServices.build(log, {
                api_name: req.originalUrl,
                request_method: req.method,
                request: `${JSON.stringify(req.body)}`,
                response: `${JSON.stringify(products)}`,
                status: 'failed'
            });
            return res.status(406).send({ message: 'Can not find the entry please try again' });
        }
        operationalServices.build(log, {
            api_name: req.originalUrl,
            request_method: req.method,
            request: `${JSON.stringify(req.body)}`,
            response: `${JSON.stringify(products)}`,
            status: 'success'
        });
        logger.info(`Entry: ${JSON.stringify(products)}`);
        return res.send({ products });
    }
    async getByIdHandler(req: Request, res: Response) {
        const request_id = req.params.mentorId;
        const product = await operationalServices.findOne(mentor, { where: { id: request_id } })
        if (!product) {
            logger.error(`Can not find the entry please try again`);
            operationalServices.build(log, {
                api_name: req.originalUrl,
                request_method: req.method,
                request: `${JSON.stringify(req.body)}`,
                response: `${JSON.stringify(product)}`,
                status: 'failed'
            });
            return res.status(406).send({ message: 'Can not find the entry please try again' });
        }
        operationalServices.build(log, {
            api_name: req.originalUrl,
            request_method: req.method,
            request: `${JSON.stringify(req.body)}`,
            response: `${JSON.stringify(product)}`,
            status: 'success'
        });
        logger.info(`Entry Found`)
        return res.send({ product });
    }
    async updateHandler(req: Request, res: Response) {
        const request_id = req.params.mentorId;
        const updateObject = req.body;
        const product = await operationalServices.findOne(mentor, {
            where: { id: request_id }
        });
        console.log(product);
        if (!product) {
            logger.error(`Can not find the entry please try again`);
            operationalServices.build(log, {
                api_name: req.originalUrl,
                request_method: req.method,
                request: `${JSON.stringify(req.body)}`,
                response: `${JSON.stringify(product)}`,
                status: 'failed'
            });
            return res.status(406).send({ message: 'Can not find the entry please try again' });
        }
        const response = await operationalServices.updateOne(mentor, updateObject, { where: { id: request_id } });
        operationalServices.build(log, {
            api_name: req.originalUrl,
            request_method: req.method,
            request: `${JSON.stringify(req.body)}`,
            response: `${JSON.stringify(response)}`,
            status: 'success'
        });
        logger.info(`Product updated ${JSON.stringify(response)}`)
        return res.send({ response });
    };
    async deleteHandler(req: Request, res: Response) {
        const request_id = req.params.mentorId;
        const product = await operationalServices.findOne(mentor, {
            where: {
                id: request_id
            }
        });
        if (!product) {
            logger.error(`Can not find the entry please try again`);
            operationalServices.build(log, {
                api_name: req.originalUrl,
                request_method: req.method,
                request: `${JSON.stringify(req.body)}`,
                response: `${JSON.stringify(product)}`,
                status: 'failed'
            });
            return res.status(406).send({ message: 'Can not find the entry please try again' });
        }
        const response = await operationalServices.destroyOne(mentor, {
            where: {
                id: request_id
            }
        });
        operationalServices.build(log, {
            api_name: req.originalUrl,
            request_method: req.method,
            request: `${JSON.stringify(req.body)}`,
            response: `${JSON.stringify(response)}`,
            status: 'success'
        });
        logger.info(`Product delete}`);
        return res.send({ deletedMentor: response, text: 'successfully delete the entry' })
    }
}

export default new mentorController();