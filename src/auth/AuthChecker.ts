import { AuthenticationError } from "apollo-server-express";
import { AuthChecker, UnauthorizedError } from "type-graphql";
import { verify } from "jsonwebtoken";
import { Context, JwtPayload } from "../types";
import prisma from "../prisma/client";

export const authChecker: AuthChecker<Context> = async (
    { context },
    _roles,
) => {
    // const { req } = context;
    // console.log(req);
    // const authorization = req.get("Authorization");

    // if (!authorization) throw new UnauthorizedError();

    try {
        // const token = authorization.split(" ")[1] || " ";
        // const user = verify(
        //     token,
        //     process.env.JWT_SECRET || "JWT_SECRET",
        // ) as JwtPayload;

        // const userDetails = await prisma.user.findFirst({
        //     where: { id: user.id },
        // });
        context.user = {
            email: "hassankhawar21@gmail.com",
            id: 1,
            name: "Hassan Khawar",
            password:
                "$2b$04$PoE5KU1dbwQT2SNoTCeEA.wFAi8RqlEE85GDynvm00DG/OGN38ZC.",
            role: "admin",
        };
    } catch (e) {
        throw new AuthenticationError("You are not logged in");
    }

    return true;
};
