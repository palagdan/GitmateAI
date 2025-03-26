import {Probot} from "probot";

import dotenv from "dotenv";

import webhooks from "./webhooks.js";
import routes from "./routes.js";

dotenv.config()


export default (app: Probot, {getRouter}) => {
    webhooks(app);
    routes(app, getRouter)
};
