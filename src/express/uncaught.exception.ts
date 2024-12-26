import { logger, shortErrorParser } from "@klapeks/utils";


let isUncaughtExceptionHandlerEnabled = false;
export function handleUncaughtException() {
    if (isUncaughtExceptionHandlerEnabled) return;
    isUncaughtExceptionHandlerEnabled = true;
    process.on('uncaughtException', err => {
        logger.error(`Uncaught Exception: (${typeof err}): ${shortErrorParser(err)}`);
        logger.error('└', err);
    });
}