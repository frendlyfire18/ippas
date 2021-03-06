import {Express,Request, Response} from "express";
import {Redis} from "ioredis";

export type MyContext ={
    redis:Redis,
    req: Request & { // @ts-ignore
        session: Express.Session;}
    res:Response
}