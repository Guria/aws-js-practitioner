export class AuthService {
  constructor(private users: Record<string, string>) {}

  private decodeToken(token: string) {
    const [username, password] = Buffer.from(token, "base64")
      .toString("utf-8")
      .split(":");

    if (!username || !password || !/^\w+$/.test(username)) {
      throw new Error("Invalid token");
    }

    return { username: username.toUpperCase(), password };
  }

  private verifyUser(username: string, password: string) {
    const isUserExist = username in this.users;
    const storedPassword = this.users[username];
    return isUserExist && storedPassword === password;
  }

  verifyToken(token: string) {
    const { username, password } = this.decodeToken(token);
    return this.verifyUser(username, password);
  }
}
