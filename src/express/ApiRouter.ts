import express from 'express';
import MRouter from './mrouter';
import { ApiFunction } from '@klapeks/api-creation-tools';
import { assertNever } from '@klapeks/utils';

export class ApiRouter<BaseURL extends string> extends MRouter {

    /** @param baseUrl for validation */
    constructor(readonly baseUrl: BaseURL) {
        super();
    }

    private _urlOfBase(url: string) {
        let baseUrl = this.baseUrl as string;
        if (!baseUrl.endsWith('/')) baseUrl += '/';
        if (url.startsWith(baseUrl)) {
            return '/' + url.substring(baseUrl.length);
        }
        if (url.startsWith('/api') && !baseUrl.startsWith('/api')) {
            if (url.startsWith(baseUrl.substring(4))) {
                return '/' + url.substring(baseUrl.length + 4);
            }
        }
        return undefined;
    }

    listenApi<
        TF extends ApiFunction<TURL, TResponse, TRequest, TQuery>['return'],
        TResponse extends object = TF['response'], 
        TRequest extends object = TF['body'], 
        TQuery extends object = TF['query'],
        TURL extends string = TF['apiOptions']['url'],
    >(
        apiFunction: TURL extends `${BaseURL}/${string}` ? TF 
            : `                                             PIROJKI!                        ${""
            }URL ${TURL} must starts with baseUrl ${BaseURL}/ of router!!`,
        callback: (
            req: Omit<express.Request, 'body' | 'query'> & { 
                body: TRequest, query: TQuery 
            }, 
            res: express.Response
        ) => (Promise<TF['response']> | TF['response'])
    ) {
        if (typeof apiFunction != 'function') throw "Not a function";
        if (apiFunction.__type != 'ApiCreationToolsFunction') {
            throw "Not an api-creation-tools-function";
        }
        // url parse
        const url = this._urlOfBase(apiFunction.apiOptions.url);
        const method = apiFunction.apiOptions.request.method;
        if (!url) {
            throw `Api url ${apiFunction.apiOptions.url} is not starts with baseUrl ${this.baseUrl}`;
        }

        switch (method) {
            case "POST": this.post(url, callback as any); break;
            case "GET": this.get(url, callback as any); break;
            case "DELETE": this.delete(url, callback as any, true); break;
            case "PATCH": this.patch(url, callback as any, true); break;
            default: assertNever(method, "Unknown method: " + method);
        }
    }
}