import { Query } from "mysql2";
import { QueryOptionsTransactionRequired, where } from "sequelize/types";
import { courses } from "../models/course.model";

/**
 * service for all the courser controllers logic isolated
 */
class courseService {
    async buildCourse(input: any) {
        // const id = UUIDV4();
        try {
            const newEntry = await courses.create(input);
            return newEntry.toJSON()
        } catch (error: any) {
            return error.message
        }
    };
    async findCourse(courser_id: string) {
        try {
            const result = await courses.findOne({ where: { courser_id } });
            return result
        } catch (error: any) {
            return error.message
        }
    };
    async updateCourse(update: object, query: string) {
        try {
            const result = await courses.update(update, { where: { courser_id: query } });
            return result;
        } catch (error: any) {
            return error.message
        }
    };
    async destroyCourse(courser_id: string) {
        try {
            const result = await courses.destroy({ where: { courser_id } });
            return result;
        } catch (error: any) {
            return error.message
        }
    }

}

export default new courseService();