import {
    Arg,
    Authorized,
    Ctx,
    Field,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from "type-graphql";
import prisma from "../prisma/client";
import { compare } from "bcrypt";
import { Context } from "../types";
import { UserInputError } from "apollo-server-express";
import { hashPassword } from "../utils/password";
const jwt = require("jsonwebtoken");
import { AccessRole } from "@prisma/client";

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

        const token = jwt.sign(
            user.id,
            process.env.JWT_SECRET || "JWT_SECRET",
            {
                expiresIn: 36000000,
            },
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
        @Arg("role", () => String) role: AccessRole,
    ): Promise<AuthenticationToken> {
        const userCount = await prisma.user.count({ where: { email } });
        const alreadyExists = userCount > 0;

        if (alreadyExists) throw new Error("Email already exists");

        const passwordHash = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                password: passwordHash,
                role,
            },
        });

        const token = jwt.sign(user, process.env.JWT_SECRET || "JWT_SECRET");
        return {
            authenticationToken: token,
        };
    }
}
