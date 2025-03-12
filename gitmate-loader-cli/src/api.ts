import {Octokit} from "octokit";
import axios from "axios";

export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

export const api = axios.create({
    baseURL: process.env.BACKEND_URL,
})