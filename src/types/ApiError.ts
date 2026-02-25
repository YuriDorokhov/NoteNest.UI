export class ApiError extends Error {
  public code: "UNAUTHORIZED" | "NOT_FOUND" | "SERVER_ERROR" | "NETWORK_ERROR";

  constructor(code: "UNAUTHORIZED" | "NOT_FOUND" | "SERVER_ERROR" | "NETWORK_ERROR") {
    super(code);
    this.code = code;

    // Fix prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}