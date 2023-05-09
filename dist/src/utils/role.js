"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserAllowed = void 0;
function isUserAllowed(currentUser, allowedRoles) {
    return currentUser.some((role) => allowedRoles.includes(role));
}
exports.isUserAllowed = isUserAllowed;
//# sourceMappingURL=role.js.map