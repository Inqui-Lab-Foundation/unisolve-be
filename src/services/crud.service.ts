export default class CRUDService  {
    async create(model: any, input: any) {
        try {
            return await model.create({ ...input });
        } catch (error: any) {
            return error.message;
        }
    };
    async findOne(model: any, query: object) {
        
        try {
            const data = await model.findOne(query);
            // delete data.dataValues.password;
            return data;
        } catch (error: any) {
            return error.message;
        }
    };
    async findAll(model: any) {
        try {
            const data = await model.findAll();
            data.filter(function(rec: any){
                delete rec.dataValues.password;
                return rec;
            });
            return data;
        } catch (error: any) {
            return error.message;
        }
    };
    async findByPk(model: any, input: string) {
        try {
            return await model.findByPk(input);
        } catch (error: any) {
            return error.message;
        }
    };
    async update(model: any, update: object, query: object) {
        try {
            return await model.update(update, query);
        } catch (error: any) {
            return error.message;
        }
    };
    async delete(model: any, query: object) {
        try {
            return await model.destroy(query);
        } catch (error: any) {
            return error.message;
        }
    };
    // async createCourse(model: any, body: object) {

    // }
}
