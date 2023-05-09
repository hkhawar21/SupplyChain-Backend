"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authChecker = exports.getUserFromToken = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const jsonwebtoken_1 = require("jsonwebtoken");
const client_1 = __importDefault(require("../prisma/client"));
const getUserFromToken = async (req) => {
    const authorization = req.get("Authorization");
    if (!authorization)
        return null;
    try {
        const token = authorization.split(" ")[1] || " ";
        const user = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET || "JWT_SECRET");
        const userDetails = await client_1.default.user.findFirst({
            where: { id: user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                password: true,
            },
        });
        return userDetails;
    }
    catch (e) {
        throw new apollo_server_express_1.AuthenticationError("You are not logged in");
    }
};
exports.getUserFromToken = getUserFromToken;
const authChecker = async ({ context }, _roles) => {
    const { req } = context;
    const authorization = req.get("Authorization");
    if (!authorization)
        throw new type_graphql_1.UnauthorizedError();
    try {
        const token = authorization.split(" ")[1] || " ";
        const user = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET || "JWT_SECRET");
        const userDetails = await client_1.default.user.findFirst({
            where: { id: user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                password: true,
            },
        });
        context.user = userDetails;
    }
    catch (e) {
        throw new apollo_server_express_1.AuthenticationError("You are not logged in");
    }
    return true;
};
exports.authChecker = authChecker;
// context.user = {
//     email: "hassankhawar21@gmail.com",
//     id: 1,
//     name: "Hassan Khawar",
//     password:
//         "$2b$04$PoE5KU1dbwQT2SNoTCeEA.wFAi8RqlEE85GDynvm00DG/OGN38ZC.",
//     role: "admin",
// };
//# sourceMappingURL=AuthChecker.js.map