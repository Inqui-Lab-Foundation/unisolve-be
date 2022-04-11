import { course } from "../models/course.model";
import dbServices from './database.services';

/**
 * service for all the courser controllers logic isolated
 */
class courseService {
    buildCourse(input: any) {
        try {
            const newEntry = dbServices.buildFunction({ tableName: course, input: { ...input } });
            return newEntry;
        } catch (error: any) {
            return error.message
        }
    };
    findCourse(id: string) {
        try {
            const result = dbServices.findOneFunction(course, { where: { id } });
            return result
        } catch (error: any) {
            return error.message
        }
    };
    findCourses() {
        return dbServices.findAllFunction(course)
    }
    updateCourse(update: object, query: string) {
        try {
            const result = dbServices.updateFunction(course, update, { where: { id : query } });
            return result;
        } catch (error: any) {
            return error.message
        }
    };
    destroyCourse(id: string) {
        try {
            const result = dbServices.deleteFunction(course, { where: { id } });
            return result;
        } catch (error: any) {
            return error.message
        }
    }
}

export default new courseService();