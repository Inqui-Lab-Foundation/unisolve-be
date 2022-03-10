import { Request, Response } from "express";

import mentorServices from "../services/mentor.services";
// import { mentorPayloadInput } from "../schemas/mentor/mentorCreatePayload.schema";
import { mentor } from "../models/mentor.model";

class mentorController {
    async createMentor(
        req: Request<{}, {}/*, mentorPayloadInput["body"]*/>,
        res: Response) {
        const { module, mentor_id, statue } = req.body;
        const product = await mentorServices.buildMentor({ module, mentor_id, statue });
        return res.send(product)
    }
    async getMentor(
        req: Request<{}, {}>,
        res: Response) {
        const product = await mentor.findAll()
        if (!product) {
            return res.sendStatus(404);
        }
        return res.send({ product });
    }
    async getMentorById(
        req: Request,
        res: Response) {
        const id = req.params.mentorId;
        const product = await mentor.findOne({ where: { id } })
        if (!product) {
            return res.sendStatus(404);
        }
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
            return res.sendStatus(404);
        }
        const updatedMentor = await mentorServices.updateMentor(update, mentor_id);
        return res.send(updatedMentor);
    };

    async deleteMentor(
        req: Request,
        res: Response
    ) {
        const mentor_id = req.params.mentorId;
        const entry = await mentorServices.findMentor(mentor_id);
        if (!entry) {
            return res.sendStatus(404);
        }
        const deleteMentor = await mentorServices.destroyMentor(mentor_id);
        return res.send({ deleteMentor, text: 'successfully delete the entry' })
    }
}

export default new mentorController();