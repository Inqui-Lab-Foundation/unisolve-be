import e, { Router, Request, Response, NextFunction, response } from 'express';
import path from 'path';
import { Op } from 'sequelize';
import fs, { stat } from 'fs';
import IController from '../interfaces/controller.interface';
import HttpException from '../utils/exceptions/http.exception';
import CRUDService from '../services/crud.service';
import { badRequest, notFound } from 'boom';
import dispatcher from '../utils/dispatch.util';
import { speeches } from '../configs/speeches.config';
import { constents } from '../configs/constents.config';

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
        this.router.get(`${this.path}/:model`, this.getData.bind(this));
        this.router.get(`${this.path}/:model/:id`, this.getData.bind(this));
        this.router.post(`${this.path}/:model`, this.createData.bind(this));
        this.router.post(`${this.path}/:model/withfile`, this.createDataWithFile.bind(this));
        this.router.put(`${this.path}/:model/:id`, this.updateData.bind(this));
        this.router.put(`${this.path}/:model/:id/withfile`, this.updateDataWithFile.bind(this));
        this.router.delete(`${this.path}/:model/:id`, this.deleteData.bind(this));
    }

    protected async loadModel(model: string): Promise<Response | void | any> {
        const modelClass = await import(`../models/${model}.model`);
        return modelClass[model];
    };

    protected getPagination(page: any, size: any) {
        const limit = size ? +size : 3;
        const offset = page ? page * limit : 0;
        return { limit, offset };
    };

    protected getPagingData(data: any, page: any, limit: any) {
        const { count: totalItems, rows: dataValues } = data;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
        return { totalItems, dataValues, totalPages, currentPage };
    };

    protected async getData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any;
            const { model, id} = req.params;
            const paramStatus:any = req.query.status;
            if (model) {
                this.model = model;
            };
            // pagination
            const { page, size, title } = req.query;
            let condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
            const { limit, offset } = this.getPagination(page, size);
            console.log(limit)
            console.log(offset)
            const modelClass = await this.loadModel(model).catch(error=>{
                next(error)
            });
            const where: any = {};
            let whereClauseStatusPart:any = {};
            if(paramStatus && (paramStatus in constents.common_status_flags.list)){
                whereClauseStatusPart = {"status":paramStatus}
            }
            if (id) {
                where[`${this.model}_id`] = req.params.id;
                data = await this.crudService.findOne(modelClass, { where: {
                    [Op.and]: [
                        whereClauseStatusPart,
                        where,
                        ]
                } });
            } else {
                try{
                    const responseOfFindAndCountAll = await this.crudService.findAndCountAll(modelClass, { where: {
                        [Op.and]: [
                            whereClauseStatusPart,
                            condition
                            ]
                    }, limit, offset })
                    const result = this.getPagingData(responseOfFindAndCountAll, page, limit);
                    data = result;
                } catch(error:any){
                    return res.status(500).send(dispatcher(data, 'error'))
                }
                
            }
            // if (!data) {
            //     return res.status(404).send(dispatcher(data, 'error'));
            // }
            if (!data || data instanceof Error) {
                if(data!=null){
                    throw notFound(data.message)
                }else{
                    throw notFound()
                }
            }

            return res.status(200).send(dispatcher(data, 'success'));
        } catch (error) {
            next(error);
        }
    }

    protected async createData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { model } = req.params;
            if (model) {
                this.model = model;
            };
            const modelLoaded = await this.loadModel(model);
            const payload = this.autoFillTrackingCollumns(req, res, modelLoaded)
            const data = await this.crudService.create(modelLoaded, payload);

            // if (!data) {
            //     return res.status(404).send(dispatcher(data, 'error'));
            // }
            if (!data || data instanceof Error) {
                throw badRequest(data.message)
            }

            return res.status(201).send(dispatcher(data, 'created'));
        } catch (error) {
            next(error);
        }
    }

    protected async createDataWithFile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
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
            const modelLoaded = await this.loadModel(model);
            const payload = this.autoFillTrackingCollumns(req, res, modelLoaded, reqData)
            const data = await this.crudService.create(modelLoaded, payload);

            // if (!data) {
            //     return res.status(404).send(dispatcher(data, 'error'));
            // }
            if (!data || data instanceof Error) {
                throw badRequest(data.message)
            }
            return res.status(201).send(dispatcher(data, 'created'));
        } catch (error) {
            next(error);
        }
    }

    protected async updateData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { model, id } = req.params;
            if (model) {
                this.model = model;
            };
            const user_id = res.locals.user_id
            console.log(user_id);

            const where: any = {};
            where[`${this.model}_id`] = req.params.id;
            const modelLoaded = await this.loadModel(model);
            const payload = this.autoFillTrackingCollumns(req, res, modelLoaded)
            const data = await this.crudService.update(modelLoaded, payload, { where: where });
            // if (!data) {
            //     return res.status(404).send(dispatcher(data, 'error'));
            // }
            if (!data || data instanceof Error) {
                throw badRequest(data.message)
            }
            return res.status(200).send(dispatcher(data, 'updated'));
        } catch (error) {
            next(error);
        }
    }

    protected async updateDataWithFile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { model, id } = req.params;
            if (model) {
                this.model = model;
            };
            const user_id = res.locals.user_id
            console.log(user_id);

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
            const modelLoaded = await this.loadModel(model);
            const payload = this.autoFillTrackingCollumns(req, res, modelLoaded, reqData)
            const data = await this.crudService.update(modelLoaded, payload, { where: where });
            // if (!data) {
            //     return res.status(404).send(dispatcher(data, 'error'));
            // }
            if (!data || data instanceof Error) {
                throw badRequest(data.message)
            }
            return res.status(200).send(dispatcher(data, 'updated'));
        } catch (error) {
            next(error);
        }
    }

    protected async deleteData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { model, id } = req.params;
            if (model) {
                this.model = model;
            };
            const where: any = {};
            where[`${this.model}_id`] = req.params.id;
            const data = await this.crudService.delete(await this.loadModel(model), { where: where });
            // if (!data) {
            //     return res.status(404).send(dispatcher(data, 'error'));
            // }
            if (!data || data instanceof Error) {
                throw badRequest(data.message)
            }
            return res.status(200).send(dispatcher(data, 'deleted'));
        } catch (error) {
            next(error);
        }
    }


    protected autoFillTrackingCollumns(req: Request, res: Response, modelLoaded: any, reqData: any = null) {
        // console.log(res.locals);
        let payload = req.body;
        if (reqData != null) {
            payload = reqData
        }
        if (modelLoaded.rawAttributes.created_by !== undefined) {
            payload['created_by'] = res.locals.user_id;
        }
        if (modelLoaded.rawAttributes.updated_by !== undefined) {
            payload['updated_by'] = res.locals.user_id;
        }

        return payload;
    }
}


