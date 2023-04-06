import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { AgentsResolver } from "../resolvers";
import { AgentCreateInput, AgentUpdateInput } from "../resolvers";
import prisma from "../prisma/client";
import { authChecker } from "../auth/AuthChecker";
import { Request } from "express";

describe("AgentsResolver", () => {
    let server: ApolloServer;

    beforeAll(async () => {
        const schema = await buildSchema({
            resolvers: [AgentsResolver],
            validate: false,
            authChecker,
        });

        server = new ApolloServer({
            schema,
            context: { prisma },
        });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe("createAgent", () => {
        it("should create a new agent", async () => {
            // Define the input
            const input: AgentCreateInput = {
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
                extensions: {
                    req: {
                        headers: {
                            Authorization:
                                "Bearer eyJhbGciOiJIUzI1NiJ9.MQ.qE39ToFvx4LCHkn3tDVpMwdABQHu4woudGi6jfg3zxs",
                        },
                    },
                },
            });

            // Check the response
            expect(response.errors).toBeUndefined();
            expect(response.data).toBeDefined();
            expect(response.data?.createAgent).toBeDefined();
            expect(response.data?.createAgent.id).toBeDefined();
            expect(response.data?.createAgent.name).toEqual(input.name);
            expect(response.data?.createAgent.address).toEqual(input.address);
            expect(response.data?.createAgent.phone_number).toEqual(
                input.phone_number,
            );
            expect(response.data?.createAgent.city).toEqual(input.city);
            expect(response.data?.createAgent.status).toEqual(input.status);
        });
    });

    describe("updateAgent", () => {
        it("should update an existing agent", async () => {
            // Define the input
            const input: AgentUpdateInput = {
                id: 1,
                name: "John Doe Brent",
                address: "123 Main St",
                phone_number: "555-1234",
                city: "Any New town",
                status: true,
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
                extensions: {
                    req: {
                        headers: {
                            Authorization:
                                "Bearer eyJhbGciOiJIUzI1NiJ9.MQ.qE39ToFvx4LCHkn3tDVpMwdABQHu4woudGi6jfg3zxs",
                        },
                    },
                },
            });

            // Check the response
            expect(response.errors).toBeUndefined();
            expect(response.data).toBeDefined();
            expect(response.data?.updateAgent).toBeDefined();
            expect(response.data?.updateAgent.id).toEqual(input.id);
            expect(response.data?.updateAgent.name).toEqual(input.name);
            expect(response.data?.updateAgent.address).toEqual(input.address);
            expect(response.data?.updateAgent.phone_number).toEqual(
                input.phone_number,
            );
            expect(response.data?.updateAgent.city).toEqual(input.city);
            expect(response.data?.updateAgent.status).toEqual(input.status);
        });
    });

    describe("deleteAgent", () => {
        it("should delete an existing agent", async () => {
            // Define the input
            const input = {
                deleteAgentId: 1,
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
                extensions: {
                    req: {
                        headers: {
                            Authorization:
                                "Bearer eyJhbGciOiJIUzI1NiJ9.MQ.qE39ToFvx4LCHkn3tDVpMwdABQHu4woudGi6jfg3zxs",
                        },
                    },
                },
            });

            // Check the response
            expect(response.errors).toBeUndefined();
            expect(response.data).toBeDefined();
        });
    });

    describe("getAgents", () => {
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
                extensions: {
                    req: {
                        headers: {
                            Authorization:
                                "Bearer eyJhbGciOiJIUzI1NiJ9.MQ.qE39ToFvx4LCHkn3tDVpMwdABQHu4woudGi6jfg3zxs",
                        },
                    },
                },
            });

            // Check the response
            expect(response.errors).toBeUndefined();
            expect(response.data).toBeDefined();
            expect(response.data?.agents).toBeDefined();
        });
    });
});
