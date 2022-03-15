import { Request, Response } from "express";

import evaluatorServices from "../services/evaluator.services";
import { evaluatorPayloadInput } from "../schemas/evaluator/evaluatorCreatePayload.schema";
import { evaluator } from "../models/evaluator.model";

class evaluatorController {
    async createEvaluator(
        req: Request<{}, {}, evaluatorPayloadInput["body"]>,
        res: Response) {
        const { evaluator_name, mobile, email } = req.body;
        const product = await evaluatorServices.buildEvaluator({ evaluator_name, mobile, email });
        return res.send(product)
    }
    async getEvaluator(
        req: Request<{}, {}>,
        res: Response) {
        const product = await evaluator.findAll()
        if (!product) {
            return res.sendStatus(404);
        }
        return res.send({ product });
    }
    async getEvaluatorById(
        req: Request,
        res: Response) {
        const id = req.params.evaluatorId;
        const product = await evaluator.findOne({ where: { id } })
        if (!product) {
            return res.sendStatus(404);
        }
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
            return res.sendStatus(404);
        }
        const updatedEvaluator = await evaluatorServices.updateEvaluator(update, evaluator_Id);
        return res.send(updatedEvaluator);
    };

    async deleteEvaluator(
        req: Request,
        res: Response
    ) {
        const evaluator_Id = req.params.evaluatorId;
        const entry = await evaluatorServices.findEvaluator(evaluator_Id);
        if (!entry) {
            return res.sendStatus(404);
        }
        const deleteEvaluator = await evaluatorServices.destroyEvaluator(evaluator_Id);
        return res.send({ deleteEvaluator, text: 'successfully delete the entry' })
    }
}

export default new evaluatorController();