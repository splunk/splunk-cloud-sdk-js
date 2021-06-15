import express from 'express';
import { Server } from 'http';

export class RetryServer {
    private express = express();
    private server?: Server;
    private jammed = true;

    constructor() {
        this.express.get('/', (req, res) => {
            res.json({ success: true });
        });
        this.express.get('/logjam', (req, res) => {
            let headered = res;
            if (req.header('Retry')) {
                headered = res.header('Retry', req.header('Retry'));
            }
            if (this.jammed) {
                headered.status(429)
                    .json({ message: 'Busy' });
            } else {
                headered.status(200)
                    .json({ status: 'ok' });
            }
        });
        this.express.get('/startjam', (req, res) => {
            this.jammed = true;
            res.status(200)
                .json({ status: 'ok' });
        });
        this.express.get('/endjam', (req, res) => {
            this.jammed = false;
            res.status(200)
                .json({ status: 'ok' });
        });
        this.express.get('/always_busy', (req, res) => {
            res.status(429)
                .json({ message: 'Busy.  Go away.  Try again later' });
        });
    }

    public start(port: number = 3333) {
        this.server = this.express.listen(port);
    }

    public stop() {
        if (this.server !== undefined) {
            this.server.close();
            this.server = undefined;
        }
    }

}
