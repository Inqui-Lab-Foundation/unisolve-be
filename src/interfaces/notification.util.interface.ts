
export default interface INotificationUtil {
    notification_type: string;
    target_audience: string;
    title: string;
    image: string;
    message: string;
    // read_by: string;
    status: string;
    created_by: string|number;
}
