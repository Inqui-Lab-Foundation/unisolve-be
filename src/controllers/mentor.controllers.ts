import { Request, Response } from "express";

import mentorServices from "../services/mentor.services";
import { mentorPayloadInput } from "../schemas/mentor.schema";
import { mentor } from "../models/mentor.model";
import logger from '../utils/logger'

/**
 * Controller class for all mentor API's 
 */
class mentorController {
    async createMentor(
        req: Request<{}, {}, mentorPayloadInput["body"]>,
        res: Response) {
        const { mentor_name, email } = req.body;
        const product = await mentorServices.buildMentor({ mentor_name, email });
        logger.info(`Id found ${JSON.stringify(product)}`)
        return res.send(product)
    }
    async getMentor(
        req: Request<{}, {}>,
        res: Response) {
        const product = await mentor.findAll()
        if (!product) {
            logger.error(`Id found ${JSON.stringify(product)}`)
            return res.status(406).send({ message: 'Product not found' });
        }
        logger.info(`Id found ${JSON.stringify(product)}`)
        return res.send({ product });
    }
    async getMentorById(
        req: Request,
        res: Response) {
        const id = req.params.mentorId;
        const product = await mentorServices.findMentor(id)
        if (!product) {
            logger.error(`Id found ${JSON.stringify(product)}`)
            return res.status(406).send({ message: 'Product not found' });
        }
        logger.info(`Id found ${JSON.stringify(product)}`)
        return res.send({ product });
    }
    async updateMentor(
        req: Request,
        res: Response
    ) {
        const mentor_id = req.params.mentorId;
        const update = req.body;
        const entry = await mentorServices.findMentor(mentor_id);
        if (!entry) {
            logger.error(`Id found ${JSON.stringify(entry)} `)
            return res.status(406).send({ message: 'Product not found' });
        }
        const updatedMentor = await mentorServices.updateMentor(update, mentor_id);
        logger.info(`Id updated ${JSON.stringify(updatedMentor)} `)
        return res.send(updatedMentor);
    };
    async deleteMentor(
        req: Request,
        res: Response
    ) {
        const mentor_id = req.params.mentorId;
        const entry = await mentorServices.findMentor(mentor_id);
        if (!entry) {
            logger.error(`Id not found ${JSON.stringify(entry)} `)
            return res.status(406).send({ message: 'Product not found' });
        }
        const deleteMentor = await mentorServices.destroyMentor(mentor_id);
        logger.info(`Id deleted ${JSON.stringify(deleteMentor)} `)
        return res.send({ deleteMentor, text: 'successfully delete the entry' })
    }
}

export default new mentorController();