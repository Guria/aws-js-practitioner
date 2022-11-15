import { describe, it, expect } from "vitest";
import { AuthService } from "./auth";

describe("AuthService", () => {
  it("should verify token", () => {
    const authService = new AuthService({ USER: "password" });
    expect(authService.verifyToken("VXNlcjpwYXNzd29yZA==")).toBe(true);
  });
  it("should throw error if token is invalid", () => {
    const authService = new AuthService({ USER: "password" });
    expect(() => authService.verifyToken("--Nl")).toThrow("Invalid token");
  });
});
