import { Request, Response } from "express";

import operationalServices from "../services/operational.services";
import { modules } from "../models/modules.model";
import logger from '../utils/logger'
/**
 * Controller class for all  courser API's 
 */
class moduleController {
    async createHandler(req: Request, res: Response) {
        const product = await operationalServices.build(req.body, modules);
        if (!product) {
            logger.error(`something went wrong while creating the entry please check the payload`);
            return res.status(406).send({ message: 'something went wrong while creating the entry please check the payload' });
        }
        return res.send({ product });
    }
    async getHandler(req: Request, res: Response) {
        const products = await operationalServices.findsAll(modules);
        if (!products) {
            logger.error(`Can not find the entry please try again`);
            return res.status(406).send({ message: 'Can not find the entry please try again' });
        }
        logger.info(`Entry: ${JSON.stringify(products)}`);
        return res.send({ products });
    }
    async getByIdHandler(req: Request, res: Response) {
        const request_id = req.params.courseId;
        const product = await operationalServices.findOne(modules, {
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
        const product = await operationalServices.findOne(modules, {
            where: {
                id: request_id
            }
        });
        if (!product) {
            logger.error(`Can not find the entry please try again`);
            return res.status(406).send({ message: 'Can not find the entry please try again' });
        }
        const response = await operationalServices.updateOne(updateObject, request_id, modules);
        logger.info(`Product updated ${JSON.stringify(response)}`)
        return res.send({ response });
    };
    async deleteHandler(req: Request, res: Response) {
        const request_id = req.params.courseId;
        const product = await operationalServices.findOne(modules, {
            where: {
                id: request_id
            }
        });
        if (!product) {
            logger.error(`Can not find the entry please try again`);
            return res.status(406).send({ message: 'Can not find the entry please try again' });
        }
        const response = await operationalServices.destroyOne(request_id, modules);
        logger.info(`Product delete}`);
        return res.send({ deletedModule: response, text: 'successfully delete the entry' })
    }
}

export default new moduleController();