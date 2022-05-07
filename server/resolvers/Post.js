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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Post_1 = require("../entities/Post");
const mongodb_1 = require("mongodb");
const User_1 = require("../entities/User");
const isAuth_1 = require("../middlewares/isAuth");
const Votes_1 = require("../entities/Votes");
const Category_1 = require("../entities/Category");
const Limit_with_cursor_1 = require("../utils/Limit_with_cursor");
let PostResponse = class PostResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Post_1.Post]),
    __metadata("design:type", Array)
], PostResponse.prototype, "posts", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PostResponse.prototype, "hasMore", void 0);
PostResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], PostResponse);
const hasMore = (array, _id, limit) => {
    let res = _id === null;
    let _id_number = 0;
    array.forEach((post, number) => {
        if ((0, mongodb_1.ObjectID)(_id) === post._id.toString()) {
            _id_number = number;
        }
    });
    return res || (_id_number + limit) < array.length;
};
let PostResolver = class PostResolver {
    vote(postId, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield Votes_1.Votes.findOne({ where: { postId: postId, userId: req.session.userId } });
            if (candidate && candidate.value === 1) {
                yield Votes_1.Votes.delete({ postId: postId, userId: req.session.userId });
                const res = yield Post_1.Post.findOne({ _id: (0, mongodb_1.ObjectID)(postId) });
                res.points -= 1;
                yield Post_1.Post.update({ _id: (0, mongodb_1.ObjectID)(postId) }, res);
                return true;
            }
            else if (candidate && candidate.value === -1) {
                yield Votes_1.Votes.delete({ postId: postId, userId: req.session.userId });
                const vote = Votes_1.Votes.create({
                    userId: req.session.userId,
                    postId: postId,
                    value: 1
                });
                yield vote.save();
                const res = yield Post_1.Post.findOne({ _id: (0, mongodb_1.ObjectID)(postId) });
                res.points += 2;
                yield Post_1.Post.update({ _id: (0, mongodb_1.ObjectID)(postId) }, res);
                return true;
            }
            const res = yield Post_1.Post.findOne({ _id: (0, mongodb_1.ObjectID)(postId) });
            res.points += 1;
            const vote = Votes_1.Votes.create({
                userId: req.session.userId,
                postId: postId,
                value: 1
            });
            yield Post_1.Post.update({ _id: (0, mongodb_1.ObjectID)(postId) }, res);
            yield vote.save();
            return true;
        });
    }
    unvote(postId, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield Votes_1.Votes.findOne({ where: { postId: postId, userId: req.session.userId } });
            if (candidate && candidate.value === 1) {
                yield Votes_1.Votes.delete({ postId: postId, userId: req.session.userId });
                const vote = Votes_1.Votes.create({
                    userId: req.session.userId,
                    postId: postId,
                    value: -1
                });
                yield vote.save();
                const res = yield Post_1.Post.findOne({ _id: (0, mongodb_1.ObjectID)(postId) });
                res.points -= 2;
                yield Post_1.Post.update({ _id: new mongodb_1.ObjectID(postId) }, res);
                return true;
            }
            else if (candidate && candidate.value === -1) {
                yield Votes_1.Votes.delete({ postId: postId, userId: req.session.userId });
                const res = yield Post_1.Post.findOne({ _id: (0, mongodb_1.ObjectID)(postId) });
                res.points += 1;
                yield Post_1.Post.update({ _id: (0, mongodb_1.ObjectID)(postId) }, res);
                return true;
            }
            const res = yield Post_1.Post.findOne({ _id: (0, mongodb_1.ObjectID)(postId) });
            res.points -= 1;
            const vote = Votes_1.Votes.create({
                userId: req.session.userId,
                postId: postId,
                value: -1
            });
            yield vote.save();
            yield Post_1.Post.update({ _id: (0, mongodb_1.ObjectID)(postId) }, res);
            return true;
        });
    }
    getPosts(_id, limit, categoryId, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            let posts_res = yield Post_1.Post.find({});
            const rs = yield Votes_1.Votes.find({ where: { userId: req.session.userId } });
            posts_res.map(post => {
                post.createdAt = new Date(post.createdAt).toISOString();
                rs.map(vote => {
                    if ((vote === null || vote === void 0 ? void 0 : vote.postId) === post._id.toString()) {
                        if ((vote === null || vote === void 0 ? void 0 : vote.value) === 1) {
                            post.voteStatus = 1;
                        }
                        else {
                            post.voteStatus = -1;
                        }
                    }
                });
            });
            return {
                posts: (0, Limit_with_cursor_1.limit_with_cursor)(_id, limit, posts_res, req.session.userId),
                hasMore: hasMore(posts_res, _id, limit)
            };
        });
    }
    getAnswer() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Category_1.Category.find({});
        });
    }
    getPostsByName(_id, limit, name, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            let posts_res = yield Post_1.Post.find({});
            if (name !== undefined) {
                posts_res = posts_res.filter(p => p.title.toLowerCase().includes(name.toLowerCase()));
            }
            posts_res.map(post => {
                post.createdAt = new Date(post.createdAt).toISOString();
            });
            for (const p of posts_res) {
                p.user = yield User_1.User.findOne({ _id: new mongodb_1.ObjectID(p.userId) });
                yield Post_1.Post.update({ _id: p._id }, p);
                const vote = yield Votes_1.Votes.findOne({ where: { userId: req.session.userId, postId: p._id.toString() } });
                if (vote) {
                    p.voteStatus = vote.value;
                }
            }
            return {
                posts: (0, Limit_with_cursor_1.limit_with_cursor)(_id, limit, posts_res, req.session.userId),
                hasMore: hasMore(posts_res, _id, limit)
            };
        });
    }
    sort(categoryId, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts_res = yield Post_1.Post.find({});
            const real_result = posts_res.filter(p => p.categoryId.includes(categoryId.toString()));
            for (const p of real_result) {
                p.user = yield User_1.User.findOne({ _id: new mongodb_1.ObjectID(p.userId) });
                yield Post_1.Post.update({ _id: p._id }, p);
                const vote = yield Votes_1.Votes.findOne({ where: { userId: req.session.userId, postId: p._id.toString() } });
                if (vote) {
                    p.voteStatus = vote.value;
                }
            }
            real_result.map(post => {
                post.createdAt = new Date(post.createdAt).toISOString();
            });
            return {
                posts: real_result,
                hasMore: false
            };
        });
    }
    getOnePost(_id) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield Post_1.Post.findOne({ _id: new mongodb_1.ObjectID(_id) });
            const realDate = new Date(res.createdAt).toDateString();
            res.createdAt = realDate;
            if (res === null || res === void 0 ? void 0 : res.user.posts) {
                res === null || res === void 0 ? void 0 : res.user.posts = res === null || res === void 0 ? void 0 : res.user.posts[((_b = (_a = res === null || res === void 0 ? void 0 : res.user) === null || _a === void 0 ? void 0 : _a.posts) === null || _b === void 0 ? void 0 : _b.length) - 1];
            }
            return res;
        });
    }
    createPost(title, text, categoryId, imageUrl, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ _id: new mongodb_1.ObjectID(req.session.userId) });
            const post = Post_1.Post.create({ title: title, text: text, userId: new mongodb_1.ObjectID(req.session.userId), points: 0, user: user, categoryId: categoryId, imageURL: imageUrl });
            yield post.save();
            yield User_1.User.update({ _id: new mongodb_1.ObjectID(req.session.userId) }, (user === null || user === void 0 ? void 0 : user.posts) ? { posts: [...user.posts, post._id] } : { posts: [post._id] });
            return post;
        });
    }
    updatePost(_id, title, text, categoryId, imageURL) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.Post.findOne({ _id: (0, mongodb_1.ObjectID)(_id) });
            if (!post)
                return null;
            if (typeof post.title !== "undefined") {
                post.title = title;
                post.text = text;
                post.imageURL = imageURL;
                post.categoryId = categoryId;
                yield Post_1.Post.update({ _id: new mongodb_1.ObjectID(_id) }, post);
            }
            return post;
        });
    }
    deletePost(_id, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield Post_1.Post.findOne({ "_id": (0, mongodb_1.ObjectID)(_id) });
            if (!res) {
                return false;
            }
            if (!res.userId.toString().includes(req.session.userId)) {
                throw new Error("Not authorized");
            }
            try {
                yield Post_1.Post.delete({ "_id": (0, mongodb_1.ObjectID)(_id) });
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    getMyId({ req }) {
        return req.session.userId;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("postId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "vote", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("postId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "unvote", null);
__decorate([
    (0, type_graphql_1.Query)(() => PostResponse),
    __param(0, (0, type_graphql_1.Arg)('_id', () => String, { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('limit', () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Arg)('categoryId', () => String, { nullable: true })),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "getPosts", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Category_1.Category]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "getAnswer", null);
__decorate([
    (0, type_graphql_1.Query)(() => PostResponse),
    __param(0, (0, type_graphql_1.Arg)('_id', () => String, { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('limit', () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Arg)('name', () => String, { nullable: true })),
    __param(3, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "getPostsByName", null);
__decorate([
    (0, type_graphql_1.Query)(() => PostResponse),
    __param(0, (0, type_graphql_1.Arg)('categoryId', () => String, { nullable: true })),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "sort", null);
__decorate([
    (0, type_graphql_1.Query)(() => Post_1.Post, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('_id', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "getOnePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Post_1.Post),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('title', () => String)),
    __param(1, (0, type_graphql_1.Arg)('text', () => String)),
    __param(2, (0, type_graphql_1.Arg)('categoryId', () => String, { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('imageUrl', () => String, { nullable: true })),
    __param(4, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Post_1.Post, { nullable: true }),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('_id', () => String)),
    __param(1, (0, type_graphql_1.Arg)('title', () => String, { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('text', () => String, { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('categoryId', () => String, { nullable: true })),
    __param(4, (0, type_graphql_1.Arg)('imageURL', () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('_id', () => String)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
__decorate([
    (0, type_graphql_1.Query)(() => String, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "getMyId", null);
PostResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PostResolver);
exports.PostResolver = PostResolver;
