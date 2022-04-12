import { Request, Response } from "express";

import operationalServices from "../services/operational.services";
import { evaluator } from "../models/evaluator.model";
import logger from '../utils/logger'
/**
 * Controller class for all evaluator API's 
 */
class evaluatorController {
    async createHandler(req: Request, res: Response) {
        const product = await operationalServices.build(req.body, evaluator);
        if (!product) {
            logger.error(`something went wrong while creating the entry please check the payload`);
            return res.status(406).send({ message: 'something went wrong while creating the entry please check the payload' });
        }
        return res.send({ product });
    }
    async getHandler(req: Request, res: Response) {
        const products = await operationalServices.findsAll(evaluator);
        if (!products) {
            logger.error(`Can not find the entry please try again`);
            return res.status(406).send({ message: 'Can not find the entry please try again' });
        }
        logger.info(`Entry: ${JSON.stringify(products)}`);
        return res.send({ products });
    }
    async getByIdHandler(req: Request, res: Response) {
        const request_id = req.params.evaluatorId;
        const product = await operationalServices.findOne(evaluator, {
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
        const request_id = req.params.evaluatorId;
        const updateObject = req.body;
        const product = await operationalServices.findOne(evaluator, {
            where: {
                id: request_id
            }
        });
        if (!product) {
            logger.error(`Can not find the entry please try again`);
            return res.status(406).send({ message: 'Can not find the entry please try again' });
        }
        const response = await operationalServices.updateOne(updateObject, request_id, evaluator);
        logger.info(`Product updated ${JSON.stringify(response)}`)
        return res.send({ response });
    };
    async deleteHandler(req: Request, res: Response) {
        const request_id = req.params.evaluatorId;
        const product = await operationalServices.findOne(evaluator, {
            where: {
                id: request_id
            }
        });
        if (!product) {
            logger.error(`Can not find the entry please try again`);
            return res.status(406).send({ message: 'Can not find the entry please try again' });
        }
        const response = await operationalServices.destroyOne(request_id, evaluator);
        logger.info(`Product delete}`);
        return res.send({ deletedEvaluator: response, text: 'successfully delete the entry' })
    }
}

export default new evaluatorController();