import dotenv from 'dotenv';
import path from 'path';

// import .env file
const envPath = path.join(import.meta.dirname,'..','..','.env');
dotenv.config({ path: envPath });


class ConfigManager{
  private serverConfig: { host: string, port: number };
  private databaseConfig: {URI: string,TEST_URI:string};
  private dirConfig: { view: string, static: string };
  private bcryptConfig: {saltRounds: number}
  private sessionConfig: {name: string, secret: string,cookieMaxAge: number };
  private nanoIdConfig: { alphabet: string,size: number };
  private static instance: ConfigManager;

  private constructor() {
    this.serverConfig = {
      host: process.env.HOST || `127.0.0.1`,
      port: Number(process.env.PORT) || 3000,
    }
    this.databaseConfig = {
      URI: process.env.MONGODB_URI  || "mongodb://localhost:27017/myDb",
      TEST_URI: process.env.MONGODB_TEST_URI || "mongodb://localhost:27017/test",
    }
    this.dirConfig = {
      view: path.join(import.meta.dirname, '..', 'views'),
      static: path.join(import.meta.dirname, '../../../client/dist')
    }
    this.bcryptConfig = {
      saltRounds: 10,
    }
    this.sessionConfig = {
      name: "SessionId",
      secret: process.env.SESSION_SECRET || 'somestrongsecretstringisalwaysgoodthanbad',
      cookieMaxAge: 60 * 60  * 1000  // 5,184,000,000 2 months
    }
    this.nanoIdConfig = {
      alphabet: '0123456789abcdefghijklmnopqrstuvwxyz',
      size: 10,
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
}

export default ConfigManager.getInstance();
