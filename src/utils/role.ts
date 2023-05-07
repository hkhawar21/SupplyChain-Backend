export function isUserAllowed(currentUser: string, allowedRoles: string[]) {
    return allowedRoles.includes(currentUser);
}
