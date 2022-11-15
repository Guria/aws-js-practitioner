function extractUsersFromEnv() {
  return Object.entries(process.env).reduce((users, [key, value]) => {
    if (key.startsWith("USER_")) {
      users[key.replace("USER_", "")] = value;
    }
    return users;
  }, {} as Record<string, string>);
}

export const USERS = extractUsersFromEnv();
