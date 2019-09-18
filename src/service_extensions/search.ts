import { Constructor, delay } from './service_extension';

type SearchJobInterface = {
    sid?: string;
    status?: string;
};

export type SearchServiceInterface = {
    getJob(sid: string): Promise<SearchJobInterface>;
};

export type SearchServiceExtensions = {
    waitForJob<J extends SearchJobInterface>(job: J, pollInterval?: number, callback?: (job: J) => object) : Promise<J>;
};

export function SearchServiceExtensions<T extends Constructor<SearchServiceInterface>>(constructor: T) {
    class SearchService extends constructor {
        constructor(...args: any[]) {
            super(...args);
        }

        public async waitForJob<J extends SearchJobInterface>(jobIn: J, pollInterval?: number, callback?: (job: J) => object) : Promise<J> {
            const interval = pollInterval || 500;
            const sid = jobIn.sid;
            if (sid !== undefined) {
                let job = jobIn;
                do {
                    await delay(interval);
                    job = await this.getJob(sid) as J;
                    if (callback) {
                        callback(job);
                    }
                } while (job.status !== 'done' && job.status !== 'failed');
                return job;
            }
            return Promise.reject('No sid available on provided job');
        }


    }
    return SearchService;
}
