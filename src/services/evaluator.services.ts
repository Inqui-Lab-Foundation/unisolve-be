import { evaluator } from "../models/evaluator.model";
import dbServices from "./database.services";

/**
 * service for all the evaluator controllers logic isolated
 */
class evaluatorService {
    async buildEvaluator(input: any) {
        try {
            const newEntry = await dbServices.buildFunction(evaluator, input);
            return newEntry;
        } catch (error: any) {
            return error.message
        }
    };
    async findEvaluator(id: string) {
        try {
            const result = await dbServices.findOneFunction(evaluator, { where: { id } });
            return result
        } catch (error: any) {
            return error.message
        }
    };
    findEvaluators() {
        return dbServices.findAllFunction(evaluator)
    }
    async updateEvaluator(update: object, query: string) {
        try {
            const result = await dbServices.updateFunction(evaluator, update, { where: { id: query } });
            return result;
        } catch (error: any) {
            return error.message
        }
    };
    async destroyEvaluator(id: string) {
        try {
            const result = await dbServices.deleteFunction(evaluator, { where: { id } });
            return result;
        } catch (error: any) {
            return error.message
        }
    }

}

export default new evaluatorService();