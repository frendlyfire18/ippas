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
exports.CategoriesResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Category_1 = require("../entities/Category");
const mongodb_1 = require("mongodb");
let CategoriesResolver = class CategoriesResolver {
    addCategory(name, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.session.userId) {
                const record = Category_1.Category.create({ category: name });
                yield record.save();
                return record;
            }
            return null;
        });
    }
    deleteCategory(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Category_1.Category.delete({ "_id": new mongodb_1.ObjectID(_id) });
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Category_1.Category.find({});
        });
    }
    getOneCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = (0, mongodb_1.ObjectID)(categoryId);
            return yield Category_1.Category.findOne({ _id: _id });
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => Category_1.Category, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("name")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "addCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("_id", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "deleteCategory", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Category_1.Category]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "getCategories", null);
__decorate([
    (0, type_graphql_1.Query)(() => Category_1.Category, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("categoryId", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "getOneCategory", null);
CategoriesResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CategoriesResolver);
exports.CategoriesResolver = CategoriesResolver;
