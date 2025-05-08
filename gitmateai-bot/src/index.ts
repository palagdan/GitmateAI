
import 'reflect-metadata'
import dotenv from "dotenv";
dotenv.config()
import {Probot} from "probot";
import webhooks from "./webhooks.js";
import routes from "./routes.js";

export default (app: Probot, {getRouter}) => {
    webhooks(app);
    routes(app, getRouter)
};
