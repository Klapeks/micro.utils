import axios, { AxiosInstance } from "axios";
import { globalEnv } from "../global.env";
import { logger } from "@klapeks/utils";
import https from 'https';

type _AI = AxiosInstance;
export type MicroAxios = AxiosInstance & {
    setHeader(key: string, value: any): void;
    getData<T = any>(...params: Parameters<_AI['get']>): Promise<T>,
    postData<T = any>(...params: Parameters<_AI['post']>): Promise<T>,
    patchData<T = any>(...params: Parameters<_AI['patch']>): Promise<T>,
    deleteData<T = any>(...params: Parameters<_AI['delete']>): Promise<T>,
}

function is502err(err: any): any {
    // if (err?.response?.status === 502) {
    //     err = err.request.path || err.config.url;
    //     if (!err) throw new HttpException("Bad Gateway", 502);
    //     throw new HttpException("Can't access " + err + " (Bad Gateway)", 502);
    // }
    throw err;
}
export function createMicroAxios(uri?: string) {
    if (!uri) uri = globalEnv.servers.api;
    logger.debug("Creating big axios instance", uri);
    
    const httpsAgent = process.env.TLS_IGNORE_REJECT_UNAUTHORIZED == 'true'
        ? new https.Agent({ rejectUnauthorized: false }) : undefined;

    const api = axios.create({
        baseURL: uri, 
        httpsAgent,
        withCredentials: false,
        headers: {
            'Access-Control-Allow-Origin': '*', // * или ваш домен
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, HEAD, OPTIONS',
            'Access-Control-Allow-Headers': '*',
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    }) as any as MicroAxios;

    api.setHeader = async function(key: string, value: any) {
        api.defaults.headers[key] = value;
        logger.debug("Setting api header of", key);
    }
    api.getData = async function (...params: Parameters<_AI['get']>) {
        return (await api.get(...params).catch(is502err)).data;
    };
    api.postData = async function (...params: Parameters<_AI['post']>) {
        return (await api.post(...params).catch(is502err)).data;
    };
    api.deleteData = async function (...params: Parameters<_AI['delete']>) {
        return (await api.delete(...params).catch(is502err)).data;
    };
    api.patchData = async function (...params: Parameters<_AI['patch']>) {
        return (await api.patch(...params).catch(is502err)).data;
    };
    
    return api;
}