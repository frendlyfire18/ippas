"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const argon2_1 = __importDefault(require("argon2"));
const sendMail_1 = require("../utils/sendMail");
const uuid_1 = require("uuid");
const mongodb_1 = require("mongodb");
let UserInput = class UserInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserInput.prototype, "password", void 0);
UserInput = __decorate([
    (0, type_graphql_1.InputType)()
], UserInput);
let UserAuthInput = class UserAuthInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserAuthInput.prototype, "usernameORemail", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserAuthInput.prototype, "password", void 0);
UserAuthInput = __decorate([
    (0, type_graphql_1.InputType)()
], UserAuthInput);
let Error = class Error {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Error.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Error.prototype, "message", void 0);
Error = __decorate([
    (0, type_graphql_1.ObjectType)()
], Error);
let Response = class Response {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Error], { nullable: true }),
    __metadata("design:type", Array)
], Response.prototype, "error", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], Response.prototype, "user", void 0);
Response = __decorate([
    (0, type_graphql_1.ObjectType)()
], Response);
function checkLogin(loginString) {
    const pattern = /^[\w\d_.+-]+@[\w\d-]+.[\w]+$/;
    return pattern.test(loginString);
}
function checkPass(loginString) {
    const pattern = /^[^<>%$\[\]\\\/\&\!\@\?\$]*$/;
    return pattern.test(loginString);
}
let UserResolver = class UserResolver {
    email(user, { req }) {
        if (req.session.userId === user._id)
            return user.email;
        return null;
    }
    checkAuth({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.session.userId) {
                const user = yield User_1.User.findOne({ _id: new mongodb_1.ObjectID(req.session.userId) });
                return {
                    user: user
                };
            }
            else {
                return {
                    error: [
                        {
                            field: "User",
                            message: "User don't authorized"
                        }
                    ],
                };
            }
        });
    }
    changePassword(token, password, { redis, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!checkPass(password)) {
                return {
                    error: [
                        {
                            field: "password",
                            message: "Bad input"
                        }
                    ]
                };
            }
            if (password.length <= 3) {
                return {
                    error: [
                        {
                            field: "password",
                            message: "Length of password can't be less than 3 symbols"
                        }
                    ]
                };
            }
            const key = "forgot-pass" + token;
            const userId = yield redis.get(key);
            console.log(userId);
            if (!userId) {
                return {
                    error: [
                        {
                            field: "password",
                            message: "token doesn't exist"
                        }
                    ]
                };
            }
            const user = yield User_1.User.findOne({ _id: new mongodb_1.ObjectID(userId.toString()).toString() });
            if (!user) {
                return {
                    error: [
                        {
                            field: "user",
                            message: "user doesn't exist"
                        }
                    ]
                };
            }
            user.password = yield argon2_1.default.hash(password.toString());
            yield User_1.User.update({ _id: new mongodb_1.ObjectID(userId) }, user);
            yield redis.del(key);
            req.session.userId = user._id;
            return { user };
        });
    }
    forgotPassword(email, { redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!checkLogin(email)) {
                return {
                    error: [
                        {
                            field: "email",
                            message: "Bad input"
                        }
                    ]
                };
            }
            if (!email.includes("@")) {
                return {
                    error: [
                        {
                            field: "email",
                            message: "This is not an email"
                        }
                    ]
                };
            }
            const res = yield User_1.User.findOne({ where: { email: email.toString() } });
            if (!res) {
                return {
                    error: [
                        {
                            field: "email",
                            message: "User with this email doesn't exist"
                        }
                    ]
                };
            }
            const token = (0, uuid_1.v4)();
            redis.set("forgot-pass" + token, res._id, "ex", 1000 * 60 * 60 * 24 * 3);
            yield (0, sendMail_1.sendMail)({ to: email.toString(), text: `<a href = \"http://localhost:3000/change-pass/${token}\">Reset password<a>` });
            return {
                user: {
                    email: email.toString()
                }
            };
        });
    }
    authorisation(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!checkLogin(options.usernameORemail) || !checkPass(options.password)) {
                return {
                    error: [
                        {
                            field: "name",
                            message: "Bad input"
                        },
                        {
                            field: "password",
                            message: "Bad input"
                        }
                    ]
                };
            }
            if (options.password.length <= 3 && options.usernameORemail.length <= 2) {
                return {
                    error: [
                        {
                            field: "name",
                            message: "Length of username can't be less than 2 symbols"
                        },
                        {
                            field: "password",
                            message: "Length of password can't be less than 3 symbols"
                        }
                    ]
                };
            }
            if (options.usernameORemail.length <= 2) {
                return {
                    error: [
                        {
                            field: "name",
                            message: "Length of username can't be less than 2 symbols"
                        }
                    ]
                };
            }
            if (options.password.length <= 3) {
                return {
                    error: [
                        {
                            field: "password",
                            message: "Length of password can't be less than 3 symbols"
                        }
                    ]
                };
            }
            const candidate = yield User_1.User.findOne((options.usernameORemail.includes("@"))
                ?
                    { where: { email: options.usernameORemail } }
                :
                    { where: { username: options.usernameORemail } });
            if (candidate) {
                if (yield argon2_1.default.verify(candidate.password, options.password)) {
                    req.session.userId = candidate._id;
                    return {
                        user: candidate
                    };
                }
                else {
                    return {
                        error: [
                            {
                                field: "password",
                                message: "Incorrect Password"
                            }
                        ],
                    };
                }
            }
            else {
                return {
                    error: [
                        {
                            field: "name",
                            message: "User didn't find"
                        }
                    ],
                };
            }
        });
    }
    logout({ req, res }) {
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie("qid");
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
            else {
                resolve(true);
            }
        }));
    }
    registration(options, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!checkLogin(String(options.username)) || !checkPass(String(options.password)) || !checkLogin(String(options.email))) {
                return {
                    error: [
                        {
                            field: "name",
                            message: "Bad input"
                        },
                        {
                            field: "password",
                            message: "Bad input"
                        },
                        {
                            field: "email",
                            message: "Bad input"
                        }
                    ]
                };
            }
            if (options.password.length <= 3 && options.username.length <= 2) {
                return {
                    error: [
                        {
                            field: "name",
                            message: "Length of username can't be less than 2 symbols"
                        },
                        {
                            field: "password",
                            message: "Length of password can't be less than 3 symbols"
                        }
                    ]
                };
            }
            if (options.username.length <= 2) {
                return {
                    error: [
                        {
                            field: "name",
                            message: "Length of username can't be less than 2 symbols"
                        }
                    ]
                };
            }
            if (options.password.length <= 3) {
                return {
                    error: [
                        {
                            field: "password",
                            message: "Length of password can't be less than 3 symbols"
                        }
                    ]
                };
            }
            const user = yield User_1.User.findOne({ where: { username: options.username } });
            if (!user) {
                try {
                    const hash = yield argon2_1.default.hash(options.password);
                    options.password = hash;
                    const user = User_1.User.create({ username: options.username, password: options.password, email: options.email });
                    yield user.save();
                    req.session.userId = user._id;
                    return {
                        user: user
                    };
                }
                catch (err) {
                    return {
                        error: [
                            {
                                field: "DB error",
                                message: "Something wrong with db"
                            }
                        ]
                    };
                }
            }
            else {
                return {
                    error: [
                        {
                            field: "name",
                            message: "User already exist"
                        }
                    ]
                };
            }
        });
    }
};
__decorate([
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User, Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "email", null);
__decorate([
    (0, type_graphql_1.Query)(() => Response, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "checkAuth", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Response),
    __param(0, (0, type_graphql_1.Arg)('token')),
    __param(1, (0, type_graphql_1.Arg)('password')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Response),
    __param(0, (0, type_graphql_1.Arg)('email')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Response, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserAuthInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "authorisation", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Response),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "registration", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)(User_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
