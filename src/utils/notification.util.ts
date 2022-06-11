import { constents } from "../configs/constents.config";
import INotificationUtil from "../interfaces/notification.util.interface";
import { notification } from "../models/notification.model";
import CRUDService from "../services/crud.service";
import logintodb from "./db_logger.util";
import logger from "./logger";

export default async function sendNotification(notificationData:INotificationUtil): Promise<any> {
    try {
        const crudService = new CRUDService();
        const response = await crudService.create(notification, notificationData);
        if(!response){
            logger.error("Error in sending notification");
            return Promise.reject("Error in sending notification");
        }
        return Promise.resolve(response);
    } catch (error) {
        logger.error(error);
        await logintodb(error);
    }
}
