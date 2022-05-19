import { Request, Response } from "express";
import { video } from "../models/video.model";
import logger from '../utils/logger'
import operationalServices from "../services/operational.services";
import storeLogsToDatabase from "../services/databaseLogger.service";
class VideoController {
    async createHandler(req: Request, res: Response) {
        const product = await operationalServices.build(video, req.body);
        if (!product) {
            logger.error(`Something went wrong while creating the video  ${JSON.stringify(req.body)}`);
            storeLogsToDatabase(req, product, 'failed');
            return res.status(406).send({ message: 'Something went wrong. Please check the payload' });
        }
        logger.error(`video created ${JSON.stringify(product)}`);
        storeLogsToDatabase(req, product, 'success');
        return res.status(201).json(product)
    }
    async getHandler(req: Request, res: Response) {
        const products = await operationalServices.findsAll(video);
        if (!products) {
            logger.error(`Can not find the entry Please try again`);
            storeLogsToDatabase(req, products, 'failed');
            return res.status(406).send({ message: 'Can not find the entry Please try again' });
        }
        logger.info(`Entry: ${JSON.stringify(products)}`);
        storeLogsToDatabase(req, products, 'success');
        return res.send({ products });
    }
    async getByIdHandler(req: Request, res: Response) {
        const request_id = req.params.videoId;
        const product = await operationalServices.findOne(video, { where: { id: request_id } });
        if (!product) {
            logger.error(`Can not find the entry Please try again`);
            storeLogsToDatabase(req, product, 'failed');
            return res.status(406).send({ message: 'Can not find the entry Please try again' });
        }
        storeLogsToDatabase(req, product, 'success');
        logger.info(`Entry Found`)
        return res.send({ product });
    }
    async updateHandler(req: Request, res: Response) {
        const request_id = req.params.videoId;
        const updateObject = req.body;
        const product = await operationalServices.findOne(video, { where: { id: request_id } });
        if (!product) {
            logger.error(`Can not find the entry Please try again`);
            storeLogsToDatabase(req, product, 'failed');
            return res.status(406).send({ message: 'Can not find the entry Please try again' });
        }
        const response = await operationalServices.updateOne(video, updateObject, { where: { id: request_id } });
        storeLogsToDatabase(req, response, 'success');
        logger.info(`Product updated ${JSON.stringify(response)}`)
        return res.send({ response });
    };
    async deleteHandler(req: Request, res: Response) {
        const request_id = req.params.videoId;
        const product = await operationalServices.findOne(video, {
            where: {
                id: request_id
            }
        });
        if (!product) {
            logger.error(`Can not find the entry Please try again`);
            storeLogsToDatabase(req, product, 'failed');
            return res.status(406).send({ message: 'Can not find the entry Please try again' });
        }
        const response = await operationalServices.destroyOne(video, { where: { id: request_id } });
        logger.info(`Product delete}`);
        storeLogsToDatabase(req, response, 'success');
        return res.send({ deletedVideo: response, text: 'successfully delete the entry' })
    }
}

export default new VideoController();