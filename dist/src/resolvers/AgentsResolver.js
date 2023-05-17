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
exports.AgentsResolver = exports.AgentCreateInput = exports.AgentUpdateInput = void 0;
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const client_1 = __importDefault(require("../prisma/client"));
const type_graphql_2 = require("@generated/type-graphql");
const apollo_server_express_1 = require("apollo-server-express");
const role_1 = require("../utils/role");
let AgentUpdateInput = class AgentUpdateInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], AgentUpdateInput.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], AgentUpdateInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], AgentUpdateInput.prototype, "address", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], AgentUpdateInput.prototype, "phone_number", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], AgentUpdateInput.prototype, "city", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], AgentUpdateInput.prototype, "status", void 0);
AgentUpdateInput = __decorate([
    (0, type_graphql_1.InputType)()
], AgentUpdateInput);
exports.AgentUpdateInput = AgentUpdateInput;
let AgentCreateInput = class AgentCreateInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], AgentCreateInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], AgentCreateInput.prototype, "address", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], AgentCreateInput.prototype, "phone_number", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], AgentCreateInput.prototype, "city", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], AgentCreateInput.prototype, "status", void 0);
AgentCreateInput = __decorate([
    (0, type_graphql_1.InputType)()
], AgentCreateInput);
exports.AgentCreateInput = AgentCreateInput;
let AgentsResolver = class AgentsResolver {
    async createAgent(agentCreateInput, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.user.role, [type_graphql_2.AccessRole.agents, type_graphql_2.AccessRole.admin]))
            throw new apollo_server_express_1.UserInputError("Not Authorized");
        try {
            // Restrict adding duplicate agent
            const agent = await client_1.default.agent.findFirst({
                where: {
                    ...agentCreateInput,
                },
            });
            if (agent) {
                throw new apollo_server_express_1.UserInputError("Agent already exists with this data. Please enter different details");
            }
            const createdAgent = await client_1.default.agent.create({
                data: {
                    ...agentCreateInput,
                },
            });
            return createdAgent;
        }
        catch (error) {
            console.error(error);
            throw new Error(error.message);
        }
    }
    async agents() {
        try {
            return await client_1.default.agent.findMany();
        }
        catch (error) { }
    }
    async agentById(id) {
        return await client_1.default.agent.findUnique({ where: { id } });
    }
    async updateAgent(agentUpdateInput, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.role, [type_graphql_2.AccessRole.agents, type_graphql_2.AccessRole.admin]))
            throw new apollo_server_express_1.UserInputError("Not Authorized");
        const agent = await client_1.default.agent.findUnique({
            where: { id: agentUpdateInput.id },
        });
        if (!agent)
            throw new apollo_server_express_1.UserInputError("Agent does not exists with this data. Please enter different details");
        return await client_1.default.agent.update({
            where: { id: agentUpdateInput.id },
            data: {
                ...agentUpdateInput,
            },
        });
    }
    async deleteAgent(id, ctx) {
        if (!(0, role_1.isUserAllowed)(ctx.user.role, [type_graphql_2.AccessRole.agents, type_graphql_2.AccessRole.admin]))
            throw new apollo_server_express_1.UserInputError("Not Authorized");
        await client_1.default.agent.delete({ where: { id } });
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Authorized)(),
    (0, type_graphql_1.Mutation)(() => type_graphql_2.Agent),
    __param(0, (0, type_graphql_1.Arg)("agentCreateInput", () => AgentCreateInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AgentCreateInput, Object]),
    __metadata("design:returntype", Promise)
], AgentsResolver.prototype, "createAgent", null);
__decorate([
    (0, type_graphql_1.Query)(() => [type_graphql_2.Agent]),
    (0, type_graphql_1.Authorized)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AgentsResolver.prototype, "agents", null);
__decorate([
    (0, type_graphql_1.Query)(() => type_graphql_2.Agent),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("id", () => Number)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AgentsResolver.prototype, "agentById", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => type_graphql_2.Agent),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("agentUpdateInput", () => AgentUpdateInput)),
    __param(1, (0, type_graphql_1.Ctx)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AgentUpdateInput, Object]),
    __metadata("design:returntype", Promise)
], AgentsResolver.prototype, "updateAgent", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.Authorized)(),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AgentsResolver.prototype, "deleteAgent", null);
AgentsResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], AgentsResolver);
exports.AgentsResolver = AgentsResolver;
//# sourceMappingURL=AgentsResolver.js.map