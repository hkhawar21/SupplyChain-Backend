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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const type_graphql_2 = require("@generated/type-graphql");
const client_1 = __importDefault(require("../prisma/client"));
const bcrypt_1 = require("bcrypt");
const password_1 = require("../utils/password");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let AuthenticationToken = class AuthenticationToken {
};
__decorate([
    (0, type_graphql_1.Field)((type) => String),
    __metadata("design:type", String)
], AuthenticationToken.prototype, "authenticationToken", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_2.User),
    __metadata("design:type", type_graphql_2.User)
], AuthenticationToken.prototype, "user", void 0);
AuthenticationToken = __decorate([
    (0, type_graphql_1.ObjectType)()
], AuthenticationToken);
let UserResolver = class UserResolver {
    async login(email, password) {
        const user = await client_1.default.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: "insensitive",
                },
            },
        });
        if (!user)
            throw new Error("Incorrect email/password");
        if (!(await (0, bcrypt_1.compare)(password, user.password)))
            throw new Error("Incorrect email/password");
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
        };
        const token = jsonwebtoken_1.default.sign(userData, process.env.JWT_SECRET || "JWT_SECRET");
        return {
            authenticationToken: token,
            user,
        };
    }
    async signup(name, email, password, role) {
        const existingUser = await client_1.default.user.findFirst({ where: { email } });
        if (existingUser)
            throw new Error("Email already exists");
        const passwordHash = await (0, password_1.hashPassword)(password);
        const user = await client_1.default.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                password: passwordHash,
                role,
            },
        });
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
        };
        const token = jsonwebtoken_1.default.sign(userData, process.env.JWT_SECRET || "JWT_SECRET");
        return {
            authenticationToken: token,
            user,
        };
    }
    async userById(id) {
        const user = await client_1.default.user.findFirst({ where: { id } });
        if (!user)
            throw new Error("User not found");
        return user;
    }
    async users() {
        const users = await client_1.default.user.findMany();
        return users;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => AuthenticationToken),
    __param(0, (0, type_graphql_1.Arg)("email", () => String)),
    __param(1, (0, type_graphql_1.Arg)("password", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => AuthenticationToken),
    __param(0, (0, type_graphql_1.Arg)("name", () => String)),
    __param(1, (0, type_graphql_1.Arg)("email", () => String)),
    __param(2, (0, type_graphql_1.Arg)("password", () => String)),
    __param(3, (0, type_graphql_1.Arg)("role", () => [String])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Array]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "signup", null);
__decorate([
    (0, type_graphql_1.Query)(() => type_graphql_2.User),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "userById", null);
__decorate([
    (0, type_graphql_1.Query)(() => [type_graphql_2.User]),
    (0, type_graphql_1.Authorized)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=UserResolver.js.map