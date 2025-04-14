import { pino } from "pino";

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    },
    serializers: {
        err: pino.stdSerializers.err
    }
});

export default logger;