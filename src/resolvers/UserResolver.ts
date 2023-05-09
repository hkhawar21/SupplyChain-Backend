import {
    Arg,
    Authorized,
    Ctx,
    Field,
    Int,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from "type-graphql";
import { User } from "@generated/type-graphql";
import prisma from "../prisma/client";
import { compare } from "bcrypt";
import { hashPassword } from "../utils/password";
import { AccessRole } from "@prisma/client";

import jwt from "jsonwebtoken";

@ObjectType()
class AuthenticationToken {
    @Field((type) => String)
    authenticationToken!: string;
}

@Resolver()
export class UserResolver {
    @Mutation(() => AuthenticationToken)
    async login(
        @Arg("email", () => String) email: string,
        @Arg("password", () => String) password: string,
    ): Promise<AuthenticationToken> {
        const user = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: "insensitive",
                },
            },
        });

        if (!user) throw new Error("Incorrect email/password");

        if (!(await compare(password, user.password)))
            throw new Error("Incorrect email/password");

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        const token = jwt.sign(
            userData,
            process.env.JWT_SECRET || "JWT_SECRET",
        );
        return {
            authenticationToken: token,
        };
    }

    @Mutation(() => AuthenticationToken)
    async signup(
        @Arg("name", () => String) name: string,
        @Arg("email", () => String) email: string,
        @Arg("password", () => String) password: string,
        @Arg("role", () => [String]) role: AccessRole[],
    ): Promise<AuthenticationToken> {
        const existingUser = await prisma.user.findFirst({ where: { email } });
        if (existingUser) throw new Error("Email already exists");

        const passwordHash = await hashPassword(password);

        const user = await prisma.user.create({
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

        const token = jwt.sign(
            userData,
            process.env.JWT_SECRET || "JWT_SECRET",
        );
        return {
            authenticationToken: token,
        };
    }

    @Query(() => User)
    @Authorized()
    async userById(@Arg("id", () => Int) id: number): Promise<User> {
        const user = await prisma.user.findFirst({ where: { id } });
        if (!user) throw new Error("User not found");
        return user;
    }

    @Query(() => [User])
    @Authorized()
    async users(): Promise<User[]> {
        const users = await prisma.user.findMany();
        return users;
    }
}
