"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = void 0;
const bcrypt_1 = require("bcrypt");
async function hashPassword(password) {
    return await (0, bcrypt_1.hash)(password, 4);
}
exports.hashPassword = hashPassword;
//# sourceMappingURL=password.js.map