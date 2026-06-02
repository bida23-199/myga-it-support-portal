export type UserAccount = {
  fullName: string;
  username: string;
  password: string;
  role: string;
  email: string;
};

export function getRegisteredUsers(): UserAccount[] {
  if (typeof window === "undefined") return [];

  const users = localStorage.getItem("registeredUsers");

  if (!users) return [];

  try {
    return JSON.parse(users);
  } catch {
    return [];
  }
}

export function saveRegisteredUsers(users: UserAccount[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("registeredUsers", JSON.stringify(users));
}

export function registerUser(newUser: UserAccount) {
  const users = getRegisteredUsers();

  const existingUser = users.find(
    (user) =>
      user.username.toLowerCase() === newUser.username.toLowerCase() ||
      user.email.toLowerCase() === newUser.email.toLowerCase()
  );

  if (existingUser) {
    return {
      success: false,
      message: "Username or email already exists.",
    };
  }

  users.push(newUser);
  saveRegisteredUsers(users);

  return {
    success: true,
    message: "Account registered successfully.",
  };
}

export function loginUser(username: string, password: string) {
  const users = getRegisteredUsers();

  const user = users.find(
    (item) =>
      item.username.toLowerCase() === username.toLowerCase() &&
      item.password === password
  );

  if (!user) {
    return {
      success: false,
      message: "Invalid username or password.",
    };
  }

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("username", user.username);
  localStorage.setItem("role", user.role);
  localStorage.setItem("email", user.email);
  localStorage.setItem("fullName", user.fullName);

  return {
    success: true,
    message: "Login successful.",
    user,
  };
}

export function resetPassword(email: string, newPassword: string) {
  const users = getRegisteredUsers();

  const userIndex = users.findIndex(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (userIndex === -1) {
    return {
      success: false,
      message: "No account found with this email address.",
    };
  }

  users[userIndex].password = newPassword;
  saveRegisteredUsers(users);

  return {
    success: true,
    message: "Password reset successfully. You can now login.",
  };
}

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

export function getFullName() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("fullName") || "";
}

export function getUserEmail() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("email") || "";
}

export function logoutUser() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  localStorage.removeItem("fullName");

  window.location.replace("/login");
}