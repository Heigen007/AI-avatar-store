import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { logger } from './common/logger';
import { globalRouter } from './api/globalRouter';

const app: Application = express();

async function init(): Promise<void> {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/api/', (req, res) => {
        res.send('AI Avatar API is running');
    });

    app.use('/api', globalRouter);

    app.listen(3000, '0.0.0.0', () => {
        logger.info('Server is running on port 3000');
    });
}

(async () => {
    try {
        await init();
    } catch (error) {
        logger.error('Global exception: ' + String(error));
        process.exit(1);
    }
})();
