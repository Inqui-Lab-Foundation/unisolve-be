import CRUDController from "./crud.controller";

export default class BaseController extends CRUDController {
    model:string="";

    protected loadModel = async (model: string): Promise<Response | void | any> => {
        const modelClass = await import(`../models/${this.model}.model`);
        return modelClass[this.model];
    }

    protected initializeRoutes(): void {
        this.router.get(`${this.path}`, this.getData);
        this.router.get(`${this.path}/:id`, this.getData);
        this.router.post(`${this.path}`, this.createData);
        this.router.put(`${this.path}/:id`, this.updateData);
        this.router.delete(`${this.path}/:id`, this.deleteData);
    }
}