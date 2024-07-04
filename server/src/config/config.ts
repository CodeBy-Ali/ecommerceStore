import dotenv from 'dotenv';
import path from 'path';

// import .env file
const envPath = path.resolve('server','.env');
dotenv.config({ path: envPath });

// type for config object
type Config = {
  host: string,
  port: number | any,
  databaseURI: string | undefined,
  dir: {
    views: string,
  }
}

console.log(process.env.MONGODB_URI)
const config: Config = {
  host: process.env.HOST || `127.0.0.1`,
  port: process.env.PORT || 3000,
  databaseURI:  process.env.MONGODB_URI,
  dir: {
    views: path.join(__dirname, '..', 'views'),
  }
}

export default config;