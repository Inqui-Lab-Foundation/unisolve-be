import e, { Router, Request, Response, NextFunction, response } from 'express';
import path from 'path';
import * as csv from "fast-csv";
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
        this.router.post(`${this.path}/:model/bulkUpload`, this.bulkUpload.bind(this));
    }

    protected async loadModel(model: string): Promise<Response | void | any> {
        const modelClass = await import(`../models/${model}.model`);
        return modelClass[model];
    };

    protected getPagination(page: any, size: any) {
        const limit = size ? +size : 1000000;
        const offset = page ? page * limit : 0;
        return { limit, offset };
    };

    protected getPagingData(data: any, page: any, limit: any) {
        const { count: totalItems, rows: dataValues } = data;
        const currentPage = page ? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
        return { totalItems, dataValues, totalPages, currentPage };
    };

    protected autoFillTrackingColumns(req: Request, res: Response, modelLoaded: any, reqData: any = null) {
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

    protected async getData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let data: any;
            const { model, id } = req.params;
            const paramStatus: any = req.query.status;
            if (model) {
                this.model = model;
            };
            // pagination
            const { page, size, title } = req.query;
            let condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
            const { limit, offset } = this.getPagination(page, size);
            const modelClass = await this.loadModel(model).catch(error => {
                next(error)
            });
            const where: any = {};
            let whereClauseStatusPart: any = {};
            if (paramStatus && (paramStatus in constents.common_status_flags.list)) {
                whereClauseStatusPart = { "status": paramStatus }
            }
            if (id) {
                where[`${this.model}_id`] = req.params.id;
                data = await this.crudService.findOne(modelClass, {
                    where: {
                        [Op.and]: [
                            whereClauseStatusPart,
                            where,
                        ]
                    }
                });
            } else {
                try {
                    const responseOfFindAndCountAll = await this.crudService.findAndCountAll(modelClass, {
                        where: {
                            [Op.and]: [
                                whereClauseStatusPart,
                                condition
                            ]
                        }, limit, offset
                    })
                    const result = this.getPagingData(responseOfFindAndCountAll, page, limit);
                    data = result;
                } catch (error: any) {
                    return res.status(500).send(dispatcher(data, 'error'))
                }

            }
            // if (!data) {
            //     return res.status(404).send(dispatcher(data, 'error'));
            // }
            if (!data || data instanceof Error) {
                if (data != null) {
                    throw notFound(data.message)
                } else {
                    throw notFound()
                }
                res.status(200).send(dispatcher(null, "error", speeches.DATA_NOT_FOUND));
                // if(data!=null){
                //     throw 
                (data.message)
                // }else{
                //     throw notFound()
                // }
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
            const payload = this.autoFillTrackingColumns(req, res, modelLoaded)
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
            const rawFiles: any = req.files;
            const files: any = Object.values(rawFiles);
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
            const payload = this.autoFillTrackingColumns(req, res, modelLoaded, reqData)
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
            const where: any = {};
            where[`${this.model}_id`] = req.params.id;
            const modelLoaded = await this.loadModel(model);
            const payload = this.autoFillTrackingColumns(req, res, modelLoaded)
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
            const rawFiles: any = req.files;
            const files: any = Object.values(rawFiles);
            const file_key: any = Object.keys(rawFiles);
            console.log(rawFiles);
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
            const payload = this.autoFillTrackingColumns(req, res, modelLoaded, reqData)
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

    protected async bulkUpload(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { model } = req.params;
        if (model) {
            this.model = model;
        };
        //@ts-ignore
        let file = req.files.data;
        let Errors: any = [];
        let bulkData: any = [];
        let counter: number = 0;
        let existedEntities: number = 0;
        let dataLength: number;

        if (file === undefined) return res.status(400).send(dispatcher(null, 'error', speeches.FILE_REQUIRED, 400));
        if (file.type !== 'text/csv') return res.status(400).send(dispatcher(null, 'error', speeches.FILE_REQUIRED, 400));
        const modelLoaded = await this.loadModel(model);
        const stream = fs.createReadStream(file.path).pipe(csv.parse({ headers: true }));
        stream.on('error', (error) => res.status(400).send(dispatcher(error, 'error', speeches.CSV_SEND_ERROR, 400)));
        stream.on('data', async (data: any) => {
            dataLength = Object.entries(data).length;
            for (let i = 0; i < dataLength; i++) {
                if (Object.entries(data)[i][1] === '') {
                    Errors.push(badRequest('missing fields', data));
                    return;
                }
            } bulkData.push(data);
        })
        stream.on('end', async () => {
            if (Errors.length > 0) next(badRequest(Errors.message));
            for (let data = 0; data < bulkData.length; data++) {
                const payload = this.autoFillTrackingColumns(req, res, modelLoaded, bulkData[data]);
                const match = await this.crudService.findOne(modelLoaded, { where: bulkData[data] });
                if (match) {
                    existedEntities++;
                } else {
                    counter++;
                    bulkData[data] = payload;
                }
            }
            if (counter > 0) {
                await this.crudService.bulkCreate(modelLoaded, bulkData)
                    .then((result) => {
                        return res.send(dispatcher({ data: result, createdEntities: counter, existedEntities }, 'success', speeches.CREATED_FILE, 200));
                    }).catch((error: any) => {
                        return res.status(500).send(dispatcher(error, 'error', speeches.CSV_SEND_INTERNAL_ERROR, 500));
                    })
            } else if (existedEntities > 0) {
                return res.status(400).send(dispatcher({ createdEntities: counter, existedEntities }, 'error', speeches.CSV_DATA_EXIST, 400));
            }
        });
    }
}