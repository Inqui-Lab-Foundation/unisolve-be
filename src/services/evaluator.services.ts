import { evaluator } from "../models/evaluator.model";

class evaluatorService {
    /**
     * 
     * @param input as request body from the express application
     * @returns object after create the entry in database
     */
    async buildEvaluator(input: any) {
        // const id = UUIDV4();
        try {
            const newEntry = await evaluator.create(input);
            return newEntry.toJSON()
        } catch (error: any) {
            return error.message
        }
    };
    async findEvaluator(id: string) {
        try {
            const result = await evaluator.findOne({ where: { id } });
            return result
        } catch (error: any) {
            return error.message
        }
    };
    async updateEvaluator(update: object, query: string) {
        try {
            const result = await evaluator.update(update, { where: { id: query } });
            return result;
        } catch (error: any) {
            return error.message
        }
    };
    async destroyEvaluator(id: string) {
        try {
            const result = await evaluator.destroy({ where: { id } });
            return result;
        } catch (error: any) {
            return error.message
        }
    }

}

export default new evaluatorService();