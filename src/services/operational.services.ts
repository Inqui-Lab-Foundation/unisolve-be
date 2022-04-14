
/**
 * service for all the courser controllers logic isolated
 */
class OperationalService {
    async build(tableName: any, input: any) {
        try {
            return await tableName.create({ ...input });
        } catch (error: any) {
            return error.message;
        }
    };
    async findOne(tableName: any, query: object) {

        try {
            return await tableName.findOne(query);
        } catch (error: any) {


            return error.message;
        }
    };
    async findsAll(tableName: any) {
        try {
            return await tableName.findAll();
        } catch (error: any) {
            return error.message;
        }
    };
    async findByPk(tableName: any, input: string) {
        try {
            return await tableName.findByPk(input);
        } catch (error: any) {
            return error.message;
        }
    };
    async updateOne(tableName: any, update: object, query: object) {
        try {
            return await tableName.update(update, query);
        } catch (error: any) {
            return error.message;
        }
    };
    async destroyOne(tableName: any, query: object) {
        try {
            return await tableName.destroy(query);
        } catch (error: any) {
            return error.message;
        }
    };
}

export default new OperationalService();