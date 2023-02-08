import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import prisma from "../prisma/client";
import { Agent } from "@generated/type-graphql/models/Agent";
import { UserInputError } from "apollo-server-express";

@Resolver()
export class AgentsResolver {
    @Mutation(() => Agent)
    @Authorized()
    async createAgent(
        @Arg("name", () => String) name: string,
        @Arg("address", () => String) address: string,
        @Arg("phone_number", () => String) phone_number: string,
        @Arg("city", () => String) city: string,
        @Arg("status", () => Boolean) status: boolean,
    ): Promise<Agent> {
        try {
            // Restrict adding duplicate agent
            const agent = await prisma.agent.findFirst({
                where: {
                    name,
                    address,
                    phone_number,
                    city,
                    status,
                },
            });

            if (agent) {
                throw new UserInputError(
                    "Agent already exists with this data. Please enter different details",
                );
            }

            const createdAgent = await prisma.agent.create({
                data: {
                    name,
                    address,
                    phone_number,
                    city,
                    status,
                },
            });

            return createdAgent;
        } catch (error: any) {
            console.error(error);
            throw new Error(error.message);
        }
    }

    @Query(() => [Agent])
    @Authorized()
    async agents() {
        try {
            return await prisma.agent.findMany();
        } catch (error) {}
    }

    @Query(() => Agent)
    @Authorized()
    async agentById(@Arg("id", () => Number) id: number) {
        return await prisma.agent.findUnique({ where: { id } });
    }

    @Mutation(() => Agent)
    @Authorized()
    async updateAgent(
        @Arg("id", () => Number) id: number,
        @Arg("name", () => String) name: string,
        @Arg("address", () => String) address: string,
        @Arg("phone_number", () => String) phone_number: string,
        @Arg("city", () => String) city: string,
        @Arg("status", () => Boolean) status: boolean,
    ) {
        const agent = await prisma.agent.findUnique({ where: { id } });
        if (!agent)
            throw new UserInputError(
                "Agent does not exists with this data. Please enter different details",
            );

        return await prisma.agent.update({
            where: { id },
            data: {
                name,
                address,
                phone_number,
                city,
                status,
            },
        });
    }

    @Mutation(() => Boolean)
    @Authorized()
    async deleteAgent(@Arg("id", () => Number) id: number) {
        await prisma.agent.delete({ where: { id } });
        return true;
    }
}
