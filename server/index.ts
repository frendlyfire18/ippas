import typeConfig from "./utils/type-orm";
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import {buildSchema} from "type-graphql";
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from "cors";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import {createConnection, Connection} from "typeorm";
import {MyContext} from "./utils/types";
import {PostResolver} from "./resolvers/Post";
import {UserResolver} from "./resolvers/User";
import {CategoriesResolver} from "./resolvers/Category";
import connect_redis from "connect-redis";
import {__prod__} from "./constants/constants";
import Redis  from "ioredis";

async function start(){
    const connection: Connection = await createConnection(typeConfig);
    const app = express();

    app.use(cors({
        origin:"http://localhost:3000",
        credentials:true
    }))

    app.use(cookieParser());

    let RedisStore = connect_redis(session);
    const redis = new Redis();

    app.use(cookieParser());

    app.use(
        session({
            name:"qid",
            store: new RedisStore({
                client: redis
            }),
            cookie:{
                maxAge:1000*60*60*24*365*10, //10 years
                httpOnly:true,
                sameSite:"lax",
                secure:__prod__
            },
            saveUninitialized: false,
            secret: 'keyboard cat',
            resave: false,
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers:[PostResolver,UserResolver,CategoriesResolver],
            validate:false
        }),
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground({
            }),
        ],
        context:({req,res}):MyContext=>({req,res,redis}),
    });

    app.get("/",(req,res)=>{
        res.json({message:"Hello world!"})
    })
    app.listen(process.env.PORT||4000,()=>{
        console.log("Server started at port")
    } )
    await apolloServer.start()
    apolloServer.applyMiddleware({app, cors: false  });
}
start().catch(err=>{
    console.log(err);
});