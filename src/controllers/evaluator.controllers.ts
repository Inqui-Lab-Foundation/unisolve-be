import { Request, Response } from "express";

import operationalServices from "../services/operational.services";
import { evaluator } from "../models/evaluator.model";
import logger from '../utils/logger'
import { log } from "../models/log";
/**
 * Controller class for all evaluator API's 
 */
class evaluatorController {
    async createHandler(req: Request, res: Response) {
        const product = await operationalServices.build(evaluator, req.body);
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
        const products = await operationalServices.findsAll(evaluator);
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
        const request_id = req.params.evaluatorId;
        const product = await operationalServices.findOne(evaluator, {
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
        const request_id = req.params.evaluatorId;
        const updateObject = req.body;
        const product = await operationalServices.findOne(evaluator, {
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
        const response = await operationalServices.updateOne(evaluator, updateObject, {
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
            operationalServices.build(log, {
                api_name: req.originalUrl,
                request_method: req.method,
                request: `${JSON.stringify(req.body)}`,
                response: `${JSON.stringify(product)}`,
                status: 'failed'
            });
            return res.status(406).send({ message: 'Can not find the entry please try again' });
        }
        const response = await operationalServices.destroyOne(evaluator, {
            where: {
                id: request_id
            }
        });
        operationalServices.build(log, {
            api_name: req.originalUrl,
            request_method: req.method,
            request: `${JSON.stringify(req.body)}`,
            response: `${JSON.stringify(product)}`,
            status: 'success'
        });
        logger.info(`Product delete}`);
        return res.send({ deletedEvaluator: response, text: 'successfully delete the entry' })
    }
}

export default new evaluatorController();