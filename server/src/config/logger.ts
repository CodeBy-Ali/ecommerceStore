import { createLogger,transports,format } from 'winston';
import { join } from 'path';
import winston from 'winston/lib/winston/config/index.js';

const env = process.env.NODE_ENV || 'development';
const logDirectory = join(import.meta.dirname, '..', 'logs');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'DD-MM-YYYY HH:mm:SS'
    }),
    format.errors({
      stack: true,
    }),
    format.json(),
    format.splat()
  ),
  transports: [
    new transports.File({
      filename: join(logDirectory,"error.log"),
      level: 'error'
    }),
    new transports.File({
      filename: join(logDirectory,"combined.log")
    })
  ]
})




if (env !== 'production') {
  logger.add(new transports.Console({
    level: "debug",
    handleExceptions: false,
    format: format.combine(
      format.colorize(),
      format.printf(info => {
        const {level,message,timestamp,...rest } = info;
        if (Object.keys(rest).length > 0) {
          return `${timestamp} ${level}: ${message} ${JSON.stringify(rest)}`
        }
        return `${timestamp} ${level}: ${message}`
      })
    )
  }))
}


export default logger;



