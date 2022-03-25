import { Request, Response } from "express";

import evaluatorServices from "../services/evaluator.services";
import { evaluatorPayloadInput } from "../schemas/evaluator.schema";
import { evaluator } from "../models/evaluator.model";
import logger from '../utils/logger'

/**
 * Controller class for all evaluator API's 
 */
class evaluatorController {
    async createEvaluator(
        req: Request<{}, {}, evaluatorPayloadInput["body"]>,
        res: Response) {
        const { evaluator_name, mobile, email } = req.body;
        const product = await evaluatorServices.buildEvaluator({ evaluator_name, mobile, email });
        if (!product) {
            logger.error(`Id not found}`)
            return res.status(406).send({ message: 'Id not found' });
        }
        logger.info(`Id found ${JSON.stringify(product)}`)
        return res.send(product)
    }
    async getEvaluator(
        req: Request<{}, {}>,
        res: Response) {
        const product = await evaluatorServices.findEvaluators();
        if (!product) {
            logger.error(`Id found ${JSON.stringify(product)}`)
            return res.status(406).send({ message: 'product not found' });
        }
        logger.info(`Id found ${JSON.stringify(product)}`)
        return res.send({ product });
    }
    async getEvaluatorById(
        req: Request,
        res: Response) {
        const id = req.params.evaluatorId;
        const product = await evaluatorServices.findEvaluator(id)
        if (!product) {
            logger.error(`Id found ${JSON.stringify(product)}`)
            return res.status(406).send({ message: 'product not found' });
        }
        logger.info(`Id found ${JSON.stringify(product)}`)
        return res.send({ product });
    }
    async updateEvaluator(
        req: Request,
        res: Response
    ) {
        const evaluator_Id = req.params.evaluatorId;
        const update = req.body;
        const entry = await evaluatorServices.findEvaluator(evaluator_Id);
        if (!entry) {
            logger.error(`Id found ${JSON.stringify(entry)}`)
            return res.status(406).send({ message: 'product not found' });
        }
        const updatedEvaluator = await evaluatorServices.updateEvaluator(update, evaluator_Id);
        logger.info(`Id updated ${JSON.stringify(updatedEvaluator)}`)
        return res.send(updatedEvaluator);
    };
    async deleteEvaluator(
        req: Request,
        res: Response
    ) {
        const evaluator_Id = req.params.evaluatorId;
        const entry = await evaluatorServices.findEvaluator(evaluator_Id);
        if (!entry) {
            logger.error(`Id not found ${JSON.stringify(entry)}`);
            return res.status(406).send({ message: 'product not found' });
        }
        const deleteEvaluator = await evaluatorServices.destroyEvaluator(evaluator_Id);
        logger.info(`Id deleted ${JSON.stringify(deleteEvaluator)}`)
        return res.send({ deleteEvaluator, text: 'successfully delete the entry' })
    }
}

export default new evaluatorController();