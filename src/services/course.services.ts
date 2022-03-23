import { Query } from "mysql2";
import { QueryOptionsTransactionRequired, where } from "sequelize/types";
import { courses } from "../models/course.model";
import dbServices from './database.services';

/**
 * service for all the courser controllers logic isolated
 */
class courseService {
    buildCourse(input: any) {
        try {
            const newEntry = dbServices.buildFunction(courses, { ...input });
            return newEntry;
        } catch (error: any) {
            return error.message
        }
    };
    findCourse(courser_id: string) {
        try {
            const result = dbServices.findOneFunction(courses, { where: { courser_id } });
            return result
        } catch (error: any) {
            return error.message
        }
    };
    findCourses() {
        return dbServices.findAllFunction(courses)
    }
    updateCourse(update: object, query: string) {
        try {
            const result = dbServices.updateFunction(courses, update, { where: { courser_id: query } });
            return result;
        } catch (error: any) {
            return error.message
        }
    };
    destroyCourse(courser_id: string) {
        try {
            const result = dbServices.deleteFunction(courses, { where: { courser_id } });
            return result;
        } catch (error: any) {
            return error.message
        }
    }

}

export default new courseService();