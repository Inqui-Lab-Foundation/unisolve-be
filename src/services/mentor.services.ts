import { mentor } from "../models/mentor.model";
import dbServices from "./database.services";

/**
 * service for all the mentor controllers logic isolated
 */
class mentorService {
    async buildMentor(input: any) {
        try {
            const newEntry = await dbServices.buildFunction({ tableName: mentor, input });
            return newEntry;
        } catch (error: any) {
            return error.message
        }
    };
    async findMentor(id: string) {
        try {
            const result = await dbServices.findOneFunction(mentor, { where: { id } });
            return result
        } catch (error: any) {
            return error.message
        }
    };
    findMentors() {
        return dbServices.findAllFunction(mentor)
    }
    async updateMentor(update: object, query: string) {
        try {
            const result = await dbServices.updateFunction(mentor, update, { where: { id: query } });
            return result;
        } catch (error: any) {
            return error.message
        }
    };
    async destroyMentor(id: string) {
        try {
            const result = await dbServices.deleteFunction(mentor, { where: { id } });
            return result;
        } catch (error: any) {
            return error.message
        }
    }

}

export default new mentorService();