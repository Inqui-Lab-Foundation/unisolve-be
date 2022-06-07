import { Router, Request, Response, NextFunction } from 'express';
import IController from '../interfaces/controller.interface';
import HttpException from '../utils/exceptions/http.exception';
import CRUDService from '../services/crud.service';
import dispatcher from '../utils/dispatch.util';

export default class CRUDController implements IController {
    public path: string;
    public router: Router;
    crudService: CRUDService = new CRUDService;

    constructor() {
        this.path = '/crud';
        this.router = Router();
        this.initializeRoutes();
    }
    private initializeRoutes(): void {
        this.router.get(`${this.path}/:model`, this.getData);
        this.router.get(`${this.path}/:model/:id`, this.getData);
        this.router.post(`${this.path}/:model`, this.createData);
        this.router.put(`${this.path}/:model/:id`, this.updateData);
        this.router.delete(`${this.path}/:model/:id`, this.deleteData);
    }

    private loadModel = async (model: string): Promise<Response | void | any> => {
        const modelClass = await import(`../models/${model}.model`);
        return modelClass[model];
    }

    private getData = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            let data: any;
            const { model, id } = req.params;

            this.loadModel(model).then(async (modelClass: any) => {
                if (id) {
                    data = await this.crudService.findOne(modelClass, { where: { id } });
                } else {
                    data = await this.crudService.findAll(modelClass);
                }

                if (!data) {
                    throw new HttpException(404, 'Data not found');
                }
                console.log(res.getHeaders());
                console.log(data.dataValues);
                return res.status(200).send(dispatcher(data, 'success'));
            });
        } catch (error) {
            next(error);
        }
    }

    private createData = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { model } = req.params;
            const data = await this.crudService.create(await this.loadModel(model), req.body);
            if (!data) {
                throw new HttpException(404, 'Data not found');
            }
            return res.status(201).send(dispatcher(data, 'created'));
        } catch (error) {
            next(error);
        }
    }

    private updateData = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { model, id } = req.params;
            const data = await this.crudService.update(await this.loadModel(model), req.body, { where: { id } });
            if (!data) {
                throw new HttpException(404, 'Data not found');
            }
            return res.status(200).send(dispatcher(data, 'updated'));
        } catch (error) {
            next(error);
        }
    }

    private deleteData = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { model, id } = req.params;
            const data = await this.crudService.delete(await this.loadModel(model), { where: { id } });
            if (!data) {
                throw new HttpException(404, 'Data not found');
            }
            return res.status(200).send(dispatcher(data, 'deleted'));
        } catch (error) {
            next(error);
        }
    }
}