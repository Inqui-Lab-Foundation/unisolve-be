export default class CRUDService  {
    async create(model: any, input: any) {
        try {
            const data = await model.create({ ...input });
            if(data){
                delete data.dataValues.password;
            }
            return data;
        } catch (error: any) {
            return error;
        }
    };
    async findOne(model: any, query: object) {
        try {
            const data = await model.findOne(query);
            if(data){
                delete data.dataValues.password;
            }
            return data;
        } catch (error: any) {
            console.log(error)
            return error;
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
            return error;
        }
    };
    async findByPk(model: any, input: string) {
        try {
            return await model.findByPk(input);
        } catch (error: any) {
            return error;
        }
    };

    async findWhere(model: any, query: object, order: object = []) {
        try {
            return await model.findAll({logging:console.log ,where: query, order: order});
        } catch (error: any) {
            return error;
        }
    };

    async update(model: any, update: object, query: object) {
        try {
            return await model.update(update, query);
        } catch (error: any) {
            return error;
        }
    };
    async delete(model: any, query: object) {
        try {
            return await model.destroy(query);
        } catch (error: any) {
            return error;
        }
    };
    // async createCourse(model: any, body: object) {

    // }
}
