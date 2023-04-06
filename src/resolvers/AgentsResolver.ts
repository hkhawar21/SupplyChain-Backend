import "reflect-metadata";
import {
    Arg,
    Authorized,
    Ctx,
    Mutation,
    Query,
    Resolver,
    InputType,
    Field,
    Int,
} from "type-graphql";
import prisma from "../prisma/client";
import { Agent } from "@generated/type-graphql";
import { UserInputError } from "apollo-server-express";

@InputType()
export class AgentUpdateInput {
    @Field(() => Int)
    id!: number;

    @Field(() => String, { nullable: true })
    name?: string;

    @Field(() => String, { nullable: true })
    address?: string;

    @Field(() => String, { nullable: true })
    phone_number?: string;

    @Field(() => String, { nullable: true })
    city?: string;

    @Field(() => Boolean, { nullable: true })
    status?: boolean;
}

@InputType()
export class AgentCreateInput {
    @Field(() => String)
    name!: string;

    @Field(() => String)
    address!: string;

    @Field(() => String)
    phone_number!: string;

    @Field(() => String)
    city!: string;

    @Field(() => Boolean)
    status!: boolean;
}

@Resolver()
export class AgentsResolver {
    @Authorized()
    @Mutation(() => Agent)
    async createAgent(
        @Arg("agentCreateInput", () => AgentCreateInput)
        agentCreateInput: AgentCreateInput,
    ): Promise<Agent> {
        try {
            // Restrict adding duplicate agent
            const agent = await prisma.agent.findFirst({
                where: {
                    ...agentCreateInput,
                },
            });

            if (agent) {
                throw new UserInputError(
                    "Agent already exists with this data. Please enter different details",
                );
            }

            const createdAgent = await prisma.agent.create({
                data: {
                    ...agentCreateInput,
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
        @Arg("agentUpdateInput", () => AgentUpdateInput)
        agentUpdateInput: AgentUpdateInput,
    ) {
        const agent = await prisma.agent.findUnique({
            where: { id: agentUpdateInput.id },
        });
        if (!agent)
            throw new UserInputError(
                "Agent does not exists with this data. Please enter different details",
            );

        return await prisma.agent.update({
            where: { id: agentUpdateInput.id },
            data: {
                ...agentUpdateInput,
            },
        });
    }

    @Mutation(() => Boolean)
    @Authorized()
    async deleteAgent(@Arg("id", () => Int) id: number) {
        await prisma.agent.delete({ where: { id } });
        return true;
    }
}
