import express from "express";
import swaggerUI from 'swagger-ui-express'
import swaggerConfigs from './swagger.json'

export const makeDocs = (app: express.Application) => {

    app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerConfigs))

};