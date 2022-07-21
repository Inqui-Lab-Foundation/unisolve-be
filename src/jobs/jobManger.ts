import { CronJob } from 'cron';
import BaseJobs from './baseJobs';

export class CronManager extends BaseJobs {
    constructor() {
        super();
        this.jobs = [];
    }
    public addJob(name: any, periodText: any, fn: any) {
        const job: any = {};
        job[name] = { name, cron: new CronJob(periodText, fn, null, true) };
        this.jobs.push(job);
    };
    public stopJob(name: any) {
        this.jobs[name].stop();
    }
    public deleteJob(name: any) {
        delete this.jobs[name];
    }
    public stopAll() {
        for (let cron in this.jobs) {
            let activeCron = this.jobs[cron].cron.running;
            if (activeCron.running) {
                activeCron.stop();
            }
        }
    }
    public listJobs() {
        return this.jobs;
    }
    public getJob(name: any) {
        for (let cron in this.jobs) {
            const activeCron = this.jobs[cron];
            if (activeCron[name].name === name) {
                return activeCron[name];
            };
        };
    };
    public startJob(name: any) {
        for (let cron in this.jobs) {
            const activeCron = this.jobs[cron];
            if (activeCron[name].name === name && !activeCron[name].running) {
                activeCron[name].cron.start();
            }
        }
    };
    public runningJob(name: any) {
        return this.jobs[name].cron.running;
    }
    public jobLastDate(name: any) {
        return this.jobs[name].cron.lastDate();
    }
    public jobNextDates(name: any) {
        return this.jobs[name].cron.nextDates();
    }
}