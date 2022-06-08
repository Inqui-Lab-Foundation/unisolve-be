import { Router, Request, Response, NextFunction } from 'express';
import IController from '../interfaces/controller.interface';
import HttpException from '../utils/exceptions/http.exception';
import CRUDService from '../services/crud.service';
import { notFound } from 'boom';
import dispatcher from '../utils/dispatch.util';
import { nextTick } from 'process';

export default class CRUDController implements IController {
    public path: string="";
    public router: Router;
    crudService: CRUDService = new CRUDService;

    constructor() {
        this.initializePath();
        this.router = Router();
        this.initializeRoutes();
    }

    protected initializePath() {
        this.path = '/crud';
    }

    protected initializeRoutes(): void {
        this.router.get(`${this.path}/:model`, this.getData);
        this.router.get(`${this.path}/:model/:id`, this.getData);
        this.router.post(`${this.path}/:model`, this.createData);
        this.router.put(`${this.path}/:model/:id`, this.updateData);
        this.router.delete(`${this.path}/:model/:id`, this.deleteData);
    }

    protected loadModel = async (model: string): Promise<Response | void | any> => {
        const modelClass = await import(`../models/${model}.model`);
        return modelClass[model];
    }

    protected getData = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            let data: any;
            const { model, id } = req.params;

            this.loadModel(model).then(async (modelClass: any) => {
                const where:any = {};
                if (id) {
                    where[`${model}_id`] = req.params.id;
                    data = await this.crudService.findOne(modelClass, {where:where});
                } else {
                    where[`${model}_id`] = req.params.id;
                    data = await this.crudService.findAll(modelClass);
                }

                if (!data) {
                    return res.status(404).send(dispatcher(data, 'error'));
                }
                return res.status(200).send(dispatcher(data, 'success'));
            });
        } catch (error) {
            next(error);
        }
    }

    protected createData = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { model } = req.params;
            const data = await this.crudService.create(await this.loadModel(model), req.body);
            if (!data) {
                return res.status(404).send(dispatcher(data, 'error'));
            }
            return res.status(201).send(dispatcher(data, 'created'));
        } catch (error) {
            next(error);
        }
    }

    protected updateData = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { model, id } = req.params;
            const where:any = {};
            where[`${model}_id`] = req.params.id;
            const data = await this.crudService.update(await this.loadModel(model), req.body, {where:where});
            if (!data) {
                return res.status(404).send(dispatcher(data, 'error'));
            }
            return res.status(200).send(dispatcher(data, 'updated'));
        } catch (error) {
            next(error);
        }
    }

    protected deleteData = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { model, id } = req.params;
            const where:any = {};
            where[`${model}_id`] = req.params.id;
            const data = await this.crudService.delete(await this.loadModel(model), { where: where });
            if (!data) {
                return res.status(404).send(dispatcher(data, 'error'));
            }
            return res.status(200).send(dispatcher(data, 'deleted'));
        } catch (error) {
            next(error);
        }
    }
}


