import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath} from 'url';
import { stringToBoolean } from '../utils/utils.ts';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// import .env file
const envPath = path.join(__dirname,'..','..','.env');
dotenv.config({ path: envPath });

class ConfigManager{
  private serverConfig: { host: string, port: number };
  private databaseConfig: {URI: string};
  private dirConfig: { view: string, static: string };
  private bcryptConfig: {saltRounds: number}
  private sessionConfig: {name: string, secret: string,cookieMaxAge: number };
  private nanoIdConfig: { alphabet: string,size: number };
  private corsConfig: { origin: string };
  private cacheConfig: {cacheAssets:boolean,maxAge: number}
  private envConfig: {env:string,isProduction:boolean,isTesting:boolean,isDevelopment:boolean}
  private env: string = process.argv[2] || process.env.NODE_ENV?.toUpperCase() || 'DEV';
  private static instance: ConfigManager;



  private constructor() {
    this.serverConfig = {
      host: process.env.HOST || `127.0.0.1`,
      port: Number(process.env.PORT) || 3000,
    }
    this.databaseConfig = {
      URI: process.env[`MONGODB_URI_${this.env}`]  || "mongodb://localhost:27017/myDb",
    }
    this.dirConfig = {
      view: path.join(__dirname, '..', 'views'),
      static: path.join(__dirname, '../../../client/dist')
    }
    this.bcryptConfig = {
      saltRounds: 10,
    }
    this.sessionConfig = {
      name: process.env[`SESSION_ID_${this.env}`] || "SessionId",
      secret: process.env.SESSION_SECRET || 'somestrongsecretstringisalwaysgoodthanbad',
      cookieMaxAge: Number(process.env[`SESSION_MAXAGE_${this.env}`]) ||  60 * 60 * 60  * 1000  // 5,184,000,000 2 months
    }
    this.nanoIdConfig = {
      alphabet: process.env.NANO_ALPHABET || '0123456789abcdefghijklmnopqrstuvwxyz',
      size: Number(process.env.NANO_SIZE) || 10,
    }
    this.corsConfig = {
      origin: process.env[`CORS_ORIGIN_${this.env}`] || "http://127.0.0.1:5500"
    }
    this.cacheConfig = {
      cacheAssets: stringToBoolean(process.env.CACHE_ASSETS || 'false') || false,
      maxAge: Number(process.env.CACHE_MAXAGE) || 604800000
    }
    this.envConfig = {
      env: this.env,
      isProduction: this.env === 'PROD',
      isDevelopment: this.env === 'DEV',
      isTesting: this.env === 'TEST',
    }  
  }


  static getInstance():ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public getDatabaseConfig() {
    return this.databaseConfig;
  }

  public getDirConfig() {
    return this.dirConfig;
  }

  public getServerConfig() {
    return this.serverConfig;
  }

  public getBcryptConfig() {
    return this.bcryptConfig;
  }

  public getSessionConfig() {
    return this.sessionConfig;
  }

  public getNanoIdConfig() {
    return this.nanoIdConfig;
  }

  public getCorsConfig() {
    return this.corsConfig;
  }

  public getCacheConfig() {
    return this.cacheConfig;
  }

  public getEnvConfig() {
    return this.envConfig;
  }
}

export default ConfigManager.getInstance();

