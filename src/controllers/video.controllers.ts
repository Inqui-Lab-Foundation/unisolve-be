import { Request, Response } from "express";

import videoServices from "../services/video.services";
import { videoPayloadInput } from "../schemas/video.schema";
import { videos } from "../models/video.model";
import logger from '../utils/logger'
/**
 * Controller class for all  courser API's 
 */
class videoController {
    async createVideo(req: Request<{}, {}, videoPayloadInput["body"]>, res: Response) {
        const product = await videoServices.buildVideo(req.body);
        if (!product) {
            logger.error(`error create a video`)
            return res.status(406).send({ message: 'error create a video' });
        }
        return res.send(product)
    }
    async getVideos(req: Request<{}, {}>, res: Response) {
        const videos = await videoServices.findVideos();
        if (!videos) {
            logger.error(`Videos not found`)
            return res.status(406).send({ message: 'Videos not found' });
        }
        logger.info(`Videos found ${JSON.stringify(videos)}`)
        return res.send({ videos });
    }
    async getVideoById(req: Request, res: Response) {
        const video_id = req.params.courseId;
        const product = await videoServices.findVideo(video_id)
        if (!product) {
            logger.error(`video not found}`)
            return res.status(406).send({ message: 'video not found' });
        }
        logger.info(`video found`)
        return res.send({ product });
    }
    async updateVideo(req: Request, res: Response) {
        const video_id = req.params.videoId;
        const update = req.body;
        const entry = await videoServices.findVideo(video_id);
        if (!entry) {
            logger.error(`Product not found}`)
            return res.status(406).send({ message: 'product not found' });
        }
        const updatedVideo = await videoServices.updateVideo(update, video_id);
        logger.info(`Product update ${JSON.stringify(updatedVideo)}`)
        return res.send(updatedVideo);
    };
    async deleteVideo(req: Request, res: Response) {
        const video_id = req.params.videoId;
        const entry = await videoServices.findVideo(video_id);
        if (!entry) {
            logger.error(`Product not found}`)
            return res.status(406).send({ message: 'product not found' });
        }
        const deleteVideo = await videoServices.destroyVideo(video_id);
        logger.info(`Product delete}`)
        return res.send({ deleteVideo, text: 'successfully delete the entry' })
    }
}

export default new videoController();