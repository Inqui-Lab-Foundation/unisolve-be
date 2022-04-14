
/**
 * service for all the courser controllers logic isolated
 */
class OperationalService {
    async build(input: any, tableName: any) {
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
    async updateOne(update: object, query: string, tableName: any) {
        try {
            return await tableName.update(update, { where: { id: query } });
        } catch (error: any) {
            return error.message;
        }
    };
    async destroyOne(id: string, tableName: any) {
        try {
            return await tableName.destroy({ where: { id } });
        } catch (error: any) {
            return error.message;
        }
    };
}

export default new OperationalService();