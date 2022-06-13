import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import IController from '../interfaces/controller.interface';
import HttpException from '../utils/exceptions/http.exception';
import CRUDService from '../services/crud.service';
import { notFound } from 'boom';
import dispatcher from '../utils/dispatch.util';
import { nextTick } from 'process';
import { speeches } from '../configs/speeches.config';

export default class CRUDController implements IController {
    model: string = "";
    public path = "";
    public router = Router();
    crudService: CRUDService = new CRUDService();

    constructor() {
        this.init();
    }

    protected init(): void {
        this.initializePath();
        this.initializeRoutes();
    }

    protected initializePath() {
        this.path = '/crud';
    }

    protected initializeRoutes(aditionalrouts: any = []): void {
        this.router.get(`${this.path}/:model`, this.getData);
        this.router.get(`${this.path}/:model/:id`, this.getData);
        this.router.post(`${this.path}/:model`, this.createData);
        this.router.post(`${this.path}/:model/withfile`, this.createDataWithFile);
        this.router.put(`${this.path}/:model/:id`, this.updateData);
        this.router.put(`${this.path}/:model/:id/withfile`, this.updateDataWithFile);
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
            if (model) {
                this.model = model;
            };
            this.loadModel(model).then(async (modelClass: any) => {
                const where: any = {};
                if (id) {
                    where[`${this.model}_id`] = req.params.id;
                    data = await this.crudService.findOne(modelClass, { where: where });
                } else {
                    where[`${this.model}_id`] = req.params.id;
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
            if (model) {
                this.model = model;
            };
            const data = await this.crudService.create(await this.loadModel(model), req.body);
            if (!data) {
                return res.status(404).send(dispatcher(data, 'error'));
            }
            return res.status(201).send(dispatcher(data, 'created'));
        } catch (error) {
            next(error);
        }
    }

    protected createDataWithFile = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { model } = req.params;
            if (model) {
                this.model = model;
            };
            const rawfiles: any = req.files;
            const files: any = Object.values(rawfiles);
            const file_key: any = Object.keys(rawfiles);
            console.log(file_key);
            const reqData: any = req.body;
            const errs: any = [];
            for (const file_name of Object.keys(files)) {
                const file = files[file_name];
                console.log(file);
                const filename = file.path.split(path.sep).pop();
                const targetPath = path.join(process.cwd(), 'resources', 'static', 'uploads', 'images', filename);
                await fs.rename(file.path, targetPath, async (err) => {
                    if (err) {
                        errs.push(`Error uploading file: ${file.originalFilename}`);
                    } else {
                        reqData[file.fieldName] = `/posters/${filename}`;
                    }
                });
            }
            if (errs.length) {
                return res.status(406).send(dispatcher(errs, 'error', speeches.NOT_ACCEPTABLE, 406));
            }
            const data = await this.crudService.create(await this.loadModel(model), reqData);
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
            if (model) {
                this.model = model;
            };
            const where: any = {};
            where[`${this.model}_id`] = req.params.id;
            const data = await this.crudService.update(await this.loadModel(model), req.body, { where: where });
            if (!data) {
                return res.status(404).send(dispatcher(data, 'error'));
            }
            return res.status(200).send(dispatcher(data, 'updated'));
        } catch (error) {
            next(error);
        }
    }

    protected updateDataWithFile = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { model, id } = req.params;
            if (model) {
                this.model = model;
            };
            const where: any = {};
            where[`${this.model}_id`] = req.params.id;
            const rawfiles: any = req.files;
            const files: any = Object.values(rawfiles);
            const file_key: any = Object.keys(rawfiles);
            console.log(rawfiles);
            console.log(files);
            console.log(file_key);
            const reqData: any = req.body;
            const errs: any = [];
            for (const file_name of Object.keys(files)) {
                const file = files[file_name];
                const filename = file.path.split(path.sep).pop();
                const targetPath = path.join(process.cwd(), 'resources', 'static', 'uploads', 'images', filename);
                await fs.rename(file.path, targetPath, async (err) => {
                    if (err) {
                        errs.push(`Error uploading file: ${file.originalFilename}`);
                    } else {
                        reqData[file.fieldName] = `/posters/${filename}`;
                    }
                });
            }
            if (errs.length) {
                return res.status(406).send(dispatcher(errs, 'error', speeches.NOT_ACCEPTABLE, 406));
            }
            const data = await this.crudService.update(await this.loadModel(model), reqData, { where: where });
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
            if (model) {
                this.model = model;
            };
            const where: any = {};
            where[`${this.model}_id`] = req.params.id;
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


