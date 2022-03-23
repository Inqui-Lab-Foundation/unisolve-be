import bcrypt from 'bcrypt'


class dbService {
    async buildFunction(databaseName: any, input: object) {
        return await databaseName.create(input);
    }
    async findOneFunction(databaseName: any, input: object) {
        return await databaseName.findOne(input);
    }
    async findAllFunction(databaseName: any) {
        return await databaseName.findAll();
    }
    async findByPkFunction(databaseName: any, input: string) {
        return await databaseName.findByPk(input);
    }
    async updateFunction(databaseName: any, dataToBeUpdated: object, input: object) {
        return await databaseName.update(dataToBeUpdated, input);
    }
    async deleteFunction(databaseName: any, input: object) {
        return await databaseName.destroy(input);
    }
    async correctPassword(enteredPassword: string, originalPassword: string) {
        return bcrypt.compareSync(enteredPassword, originalPassword);
    }
}

export default new dbService();