import axios from "axios";
import jwt from 'jsonwebtoken';
import { HttpException, HttpStatus } from "./express2/exceptions";
import express from "./express2/express2";
import tokens from "./tokens";

if (!express.SERVER_ID) throw "No express.SERVER_ID";

let path = tokens.ip;
if (!path) throw "NO GLOBAL SERVER IP"
if (!path.endsWith('/')) path += '/'
path += 'api';

export const api = axios.create({
    baseURL: path,
    timeout: 5000,
    headers: {
        'micro-server': jwt.sign(
            { server: express.SERVER_ID }, 
            tokens.server, 
            { expiresIn: '10d' }
        )
    }
});

export function validMicroServer(header: any) {
    if (typeof header !== "string") header = header['micro-server'];
    try {
        return jwt.verify(header, tokens.server) as object;
    } catch (e) {
        throw new HttpException("NOT_A_MICRO_SERVER", HttpStatus.METHOD_NOT_ALLOWED);
    }
}
