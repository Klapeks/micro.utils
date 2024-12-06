import { logger } from "@klapeks/utils";


let isUncaughtExceptionHandlerEnabled = false;
export function handleUncaughtException() {
    if (isUncaughtExceptionHandlerEnabled) return;
    isUncaughtExceptionHandlerEnabled = true;
    process.on('uncaughtException', err => {
        logger.error(`Uncaught Exception: (${typeof err}): ${err.message || err}`);
        logger.error('└', err);
    });
}