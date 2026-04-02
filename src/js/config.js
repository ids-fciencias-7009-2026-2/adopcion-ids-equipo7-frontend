// Ajusta según tu entorno
export const BASE_URL = "http://localhost:8080";

// Las APIs usan "Bearer <token>". Si el backend espera el token crudo, dejar AUTH_PREFIX = "".
export const AUTH_PREFIX = "";

// Si el backend todavía requiere query param email para /me, pon true.
// (si ya es solo token, deja false)
export const ME_USES_QUERY_EMAIL = false;

// Update endpoint:
// - Si backend usa PUT /usuarios/{email} => true
// - Si backend usa PUT /usuarios => false
export const UPDATE_USES_PATH_EMAIL = true;