import express from "express";

const routes = (app, getRouter) => {

    const routerBot = getRouter("");

    routerBot.post("", express.json(), async (req, res) => {

    });
}

export default routes;