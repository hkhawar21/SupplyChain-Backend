import { AuthenticationError } from "apollo-server-express";
import { AuthChecker, UnauthorizedError } from "type-graphql";
import { verify } from "jsonwebtoken";
import { Context, JwtPayload } from "../types";
import prisma from "../prisma/client";

export const authChecker: AuthChecker<Context> = async (
    { context },
    _roles,
) => {
    const { req } = context;
    const authorization = req.get("Authorization");

    if (!authorization) throw new UnauthorizedError();

    try {
        const token = authorization.split(" ")[1] || " ";
        const user = verify(
            token,
            process.env.JWT_SECRET || "JWT_SECRET",
        ) as JwtPayload;

        const userDetails = await prisma.user.findFirst({
            where: { id: user.id },
        });
        context.user = userDetails;
    } catch (e) {
        throw new AuthenticationError("You are not logged in");
    }

    return true;
};
