"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_orm_1 = __importDefault(require("./utils/type-orm"));
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const apollo_server_core_1 = require("apollo-server-core");
const typeorm_1 = require("typeorm");
const Post_1 = require("./resolvers/Post");
const User_1 = require("./resolvers/User");
const Category_1 = require("./resolvers/Category");
const connect_redis_1 = __importDefault(require("connect-redis"));
const constants_1 = require("./constants/constants");
const ioredis_1 = __importDefault(require("ioredis"));
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, typeorm_1.createConnection)(type_orm_1.default);
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)({
            origin: "http://localhost:3000",
            credentials: true
        }));
        app.use((0, cookie_parser_1.default)());
        let RedisStore = (0, connect_redis_1.default)(express_session_1.default);
        const redis = new ioredis_1.default();
        app.use((0, cookie_parser_1.default)());
        app.use((0, express_session_1.default)({
            name: "qid",
            store: new RedisStore({
                client: redis
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
                httpOnly: true,
                sameSite: "lax",
                secure: constants_1.__prod__
            },
            saveUninitialized: false,
            secret: 'keyboard cat',
            resave: false,
        }));
        const apolloServer = new apollo_server_express_1.ApolloServer({
            schema: yield (0, type_graphql_1.buildSchema)({
                resolvers: [Post_1.PostResolver, User_1.UserResolver, Category_1.CategoriesResolver],
                validate: false
            }),
            plugins: [
                (0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)({}),
            ],
            context: ({ req, res }) => ({ req, res, redis }),
        });
        app.get("/", (req, res) => {
            res.json({ message: "Hello world!" });
        });
        app.listen(process.env.PORT || 4000, () => {
            console.log("Server started at port");
        });
        yield apolloServer.start();
        apolloServer.applyMiddleware({ app, cors: false });
    });
}
start().catch(err => {
    console.log(err);
});
