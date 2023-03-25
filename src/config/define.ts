import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from 'fs';

if (!fs.existsSync('.env')) {
    const pathEnv = (process.env.NODE_ENV) ? `environment\\${process.env.NODE_ENV}\\.env` : '.env';
    dotenv.config({ path: path.resolve(process.cwd(), pathEnv) });
}