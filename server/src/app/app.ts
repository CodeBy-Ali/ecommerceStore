import compression from 'compression';
import express,{ Express, Request, Response } from "express";
import config from "../config/config";



// create app instance
const app: Express = express();

// set view engine
app.set('view engine', 'ejs');
app.set('views', config.dir.views);

// don't identify express
app.disable('x-powered-by');

// compress res body for response 
app.use(compression());

// parse req body of content application/x-www-form-urlencoded 
app.use(express.urlencoded({ extended: false }));

// parse req body of content json
app.use(express.json())



app.get('/', (req: Request, res: Response) => {
  res.send("<h1>First Express App</h1>");
})


export default app;