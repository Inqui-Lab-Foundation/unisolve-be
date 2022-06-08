import { log } from "../models/log.model";
import CRUDService from "../services/crud.service";
import ILogAttributes from "../interfaces/log.model.interface";

export default async function logintodb(logBody: any): Promise<any> {
    const crudService = new CRUDService();
    const res = await crudService.create(log , logBody);
}
