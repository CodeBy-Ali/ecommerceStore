import dotenv from 'dotenv';
import path from 'path';

// import .env file
const envPath = path.join(__dirname,'..','..','.env');
dotenv.config({ path: envPath });


// type for config object
type Config = {
  host: string,
  port: number | any,
  databaseURI: string,
  dir: {
    views: string,
    static: string,
  }
}

const config: Config = {
  host: process.env.HOST || `127.0.0.1`,
  port: process.env.PORT || 3000,
  databaseURI:  process.env.MONGODB_URI || "mongodb://localhost:27017/test",
  dir: {
    views: path.join(__dirname, '..', 'views'),
    static: path.join(__dirname, '../../../client/dist'),
  }
}

export default config;