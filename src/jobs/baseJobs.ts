import { CronJob } from 'cron';

export default class BaseJobs extends CronJob {
    public jobs: any
    public job_name: any;
    public cronJob: any;
    constructor() {
        super('* * * * * *', () => {
            console.log('first')
        });
        this.init();
    };
    protected init(): void {
        this.initializeJob();
    };
    protected initializeJob() {
        this.job_name = '';
    };
    protected handle(message?: any) {
        console.log(message);
    };
    public schedule() {
    }
}