"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const resolvers_1 = require("../resolvers");
const client_1 = __importDefault(require("../prisma/client"));
const AuthChecker_1 = require("../auth/AuthChecker");
const extensions = {
    req: {
        headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.MQ.qE39ToFvx4LCHkn3tDVpMwdABQHu4woudGi6jfg3zxs",
        },
    },
};
describe("AgentsResolver", () => {
    let server;
    beforeAll(async () => {
        const schema = await (0, type_graphql_1.buildSchema)({
            resolvers: [resolvers_1.AgentsResolver],
            validate: false,
            authChecker: AuthChecker_1.authChecker,
        });
        server = new apollo_server_express_1.ApolloServer({
            schema,
            context: { prisma: client_1.default },
        });
    });
    afterAll(async () => {
        await client_1.default.$disconnect();
    });
    it("should create a new agent", async () => {
        // Define the input
        const input = {
            name: "John Doe Brent",
            address: "123 Main St",
            phone_number: "555-1234",
            city: "Any New town",
            status: true,
        };
        // Define the query
        const mutation = `
        mutation CreateAgent($agentCreateInput: AgentCreateInput!) {
            createAgent(agentCreateInput: $agentCreateInput) {
            address
            city
            id
            phone_number
            name
            status
        }
        }
      `;
        // Execute the query
        const response = await server.executeOperation({
            query: mutation,
            variables: {
                agentCreateInput: input,
            },
            extensions,
        });
        // Check the response
        expect(response.errors).toBeUndefined();
        expect(response.data).toBeDefined();
        expect(response.data?.createAgent).toBeDefined();
        expect(response.data?.createAgent.id).toBeDefined();
        expect(response.data?.createAgent.name).toEqual(input.name);
        expect(response.data?.createAgent.address).toEqual(input.address);
        expect(response.data?.createAgent.phone_number).toEqual(input.phone_number);
        expect(response.data?.createAgent.city).toEqual(input.city);
        expect(response.data?.createAgent.status).toEqual(input.status);
        // Cleaning up
        await client_1.default.agent.delete({
            where: {
                id: response.data?.createAgent.id,
            },
        });
    });
    it("should update an existing agent", async () => {
        // Create an agent
        const agent = await client_1.default.agent.create({
            data: {
                name: "John Doe Brent",
                address: "123 Main St",
                phone_number: "555-1234",
                city: "Any town",
                status: true,
            },
        });
        // Define the input
        const input = {
            id: agent.id,
            name: "John Doe Matthew",
            address: "123 Main St",
            phone_number: "555-1234",
            city: "Any New town",
            status: false,
        };
        // Define the query
        const mutation = `
        mutation UpdateAgent($agentUpdateInput: AgentUpdateInput!) {
            updateAgent(agentUpdateInput: $agentUpdateInput) {
            address
            city
            id
            phone_number
            name
            status
            }
        }
            `;
        // Execute the query
        const response = await server.executeOperation({
            query: mutation,
            variables: {
                agentUpdateInput: input,
            },
            extensions,
        });
        // Check the response
        expect(response.errors).toBeUndefined();
        expect(response.data).toBeDefined();
        expect(response.data?.updateAgent).toBeDefined();
        expect(response.data?.updateAgent).toMatchObject(input);
        // Cleaning up
        await client_1.default.agent.delete({
            where: {
                id: response.data?.updateAgent.id,
            },
        });
    });
    it("should delete an existing agent", async () => {
        // Create an agent
        const agent = await client_1.default.agent.create({
            data: {
                name: "John Doe Brent",
                address: "123 Main St",
                phone_number: "555-1234",
                city: "Any town",
                status: true,
            },
        });
        // Define the input
        const input = {
            deleteAgentId: agent.id,
        };
        // Define the query
        const mutation = `
            mutation DeleteAgent($deleteAgentId: Int!) {
                deleteAgent(id: $deleteAgentId)
            }

                `;
        // Execute the query
        const response = await server.executeOperation({
            query: mutation,
            variables: {
                deleteAgentId: input.deleteAgentId,
            },
            extensions,
        });
        // Check the response
        expect(response.errors).toBeUndefined();
        expect(response.data).toBeDefined();
    });
    it("should return all agents", async () => {
        // Define the query
        const query = `
            query Agents {
  agents {
    address
    city
    id
    name
    phone_number
    status
  }
}
            `;
        // Execute the query
        const response = await server.executeOperation({
            query,
            extensions,
        });
        // Check the response
        expect(response.errors).toBeUndefined();
        expect(response.data).toBeDefined();
        expect(response.data?.agents).toBeDefined();
    });
});
//# sourceMappingURL=AgentsResolver.test.js.map