export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("isLoggedIn") === "true";
}

export function getUserRole() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("role") || "";
}

export function getUsername() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("username") || "";
}

export function logoutUser() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  localStorage.removeItem("role");

  window.location.replace("/login");
}