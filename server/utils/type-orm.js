"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("../entities/Post");
const User_1 = require("../entities/User");
const Category_1 = require("../entities/Category");
const Votes_1 = require("../entities/Votes");
exports.default = {
    "type": "mongodb",
    "url": "mongodb+srv://user:user@ippas.fgerj.mongodb.net/ippas?retryWrites=true&w=majority",
    "synchronize": true,
    "logging": true,
    "entities": [Post_1.Post, User_1.User, Category_1.Category, Votes_1.Votes]
};
