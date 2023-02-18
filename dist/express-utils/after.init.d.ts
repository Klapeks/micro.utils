import { IRouter } from "express";
export default function afterInit(app: IRouter, showErrors: boolean): () => void;
