import * as express from 'express';
import * as bodyParser from 'body-parser';
import 'dotenv/config';
import errorMiddleware from './middleware/error.middleware';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as morgan from "morgan";
import * as https from "https"
import * as fs from "fs";

class App {
    public app: express.Application;
    public port: number;

    constructor(controllers, port) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json({ limit: '5mb' }));
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(morgan('combined', {}))
    }

    private initializeControllers(controllers) {
        this.app.use('/hello', (request: any, response: any) => {
            response.send("Api Church");
        });
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    public listen() {
        /* https.createServer({
            key: fs.readFileSync('./cert/private.pem'),
            cert: fs.readFileSync('./cert/certificate.crt'),
            ca: fs.readFileSync('./cert/ca_bundle.crt'),
            passphrase: '12345678'
        }, this.app).listen(this.port, () => {
            console.log(`Api Backend DigitalSoft listening on https://localhost:${this.port}`);
        }); */

        this.app.listen(this.port, () => {
            console.log(`Api Backend DigitalSoft listening on http://localhost:${this.port}`);
        });
    }
}

export default App;

