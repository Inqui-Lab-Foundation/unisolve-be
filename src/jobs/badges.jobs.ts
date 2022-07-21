import { CronJob } from "cron";
import BaseJobs from "./baseJobs";

export default class BadgesController extends BaseJobs {
    protected inti() {
        super.init();
    };
    protected initializeJob(): void {
        this.job_name = 'keepGoing';
    };
    public schedule() {
        this.cronJob = new CronJob('2 * * * * *', async () => {
            try {
                await this.handle('something....')
            } catch (e) {
                console.error(e);
            }
        });
        // Start job
        if (!this.cronJob.running) {
            this.cronJob.start();
        }
    };
}