export function getToken() {
  return sessionStorage.getItem("token");
}

export function setSession({ token, email, userId } = {}) {
  if (token) sessionStorage.setItem("token", token);
  if (email) sessionStorage.setItem("email", email);
  if (userId) sessionStorage.setItem("userId", userId);
}

export function clearSession() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("userId");
}

export function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = "./login.html";
    return null;
  }
  return token;
}

export function getStoredEmail() {
  return sessionStorage.getItem("email");
}

export function getStoredUserId() {
  return sessionStorage.getItem("userId");
}