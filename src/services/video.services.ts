import { video } from "../models/video.model";

/**
 * service for all the courser controllers logic isolated
 */
class videoService {
    buildVideo(input: any) {
        try {
            const newEntry = dbServices.buildFunction({ tableName: videos, input: { ...input } });
            return newEntry;
        } catch (error: any) {
            return error.message
        }
    };
    findVideo(video_id: string) {
        try {
            const result = dbServices.findOneFunction(videos, { where: { video_id } });
            return result
        } catch (error: any) {
            return error.message
        }
    };
    findVideos() {
        return dbServices.findAllFunction(videos)
    }
    updateVideo(update: object, query: string) {
        try {
            const result = dbServices.updateFunction(videos, update, { where: { video_id: query } });
            return result;
        } catch (error: any) {
            return error.message
        }
    };
    destroyVideo(video_id: string) {
        try {
            const result = dbServices.deleteFunction(videos, { where: { video_id } });
            return result;
        } catch (error: any) {
            return error.message
        }
    }

}

export default new videoService();