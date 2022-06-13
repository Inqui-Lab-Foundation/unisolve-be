export default class HttpException extends Error {
    public status: number;
    public message: string;
    public data: any;
    status_type: string;
    
    constructor(status: number, message: string, data?: any) {
        super(message);
        this.status = status;
        this.message = message;
        this.data = data;
        this.status_type = 'error';
    }
}