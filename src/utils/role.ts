export function isUserAllowed(currentUser: string[], allowedRoles: string[]) {
    return currentUser.some((role) => allowedRoles.includes(role));
}
