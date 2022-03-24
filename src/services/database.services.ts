import bcrypt from 'bcrypt'


class dbService {
    async buildFunction(tableName: any, input: object) {
        return await tableName.create(input);
    }
    async findOneFunction(tableName: any, input: object) {
        return await tableName.findOne(input);
    }
    async findAllFunction(tableName: any) {
        return await tableName.findAll();
    }
    async findByPkFunction(tableName: any, input: string) {
        return await tableName.findByPk(input);
    }
    async updateFunction(tableName: any, dataToBeUpdated: object, input: object) {
        return await tableName.update(dataToBeUpdated, input);
    }
    async deleteFunction(tableName: any, input: object) {
        return await tableName.destroy(input);
    }
    async correctPassword(enteredPassword: string, originalPassword: string) {
        return bcrypt.compareSync(enteredPassword, originalPassword);
    }
}

export default new dbService();