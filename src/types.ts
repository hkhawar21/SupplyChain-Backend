import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { User } from "@generated/type-graphql";

export interface Context {
    req: Request;
    res: Response;
    user: User | null;
    prisma: PrismaClient;
}

export interface JwtPayload {
    id: number;
}
