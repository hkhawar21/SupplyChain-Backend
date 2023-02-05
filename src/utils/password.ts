import { hash } from "bcrypt";

export async function hashPassword(password: string) {
    return await hash(password, 4);
}
