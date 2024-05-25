import bodyParser from "body-parser";
import express, { Express } from "express";


const APP: Express = express();

APP.use(bodyParser.json())

export default APP;