import {
    Arg,
    Authorized,
    Ctx,
    Int,
    Mutation,
    Query,
    Resolver,
    InputType,
    Field,
    Float,
} from "type-graphql";
import prisma from "../prisma/client";
import { Inventory } from "@generated/type-graphql";
import { UserInputError } from "apollo-server-core";

@Resolver()
export class InventoryResolver {}
