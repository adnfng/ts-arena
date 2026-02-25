import type { ArenaRateLimit } from "./types.js";

export class ArenaApiError extends Error {
  public readonly name = "ArenaApiError";
  public readonly status: number;
  public readonly code?: number;
  public readonly details?: unknown;
  public readonly rateLimit?: ArenaRateLimit;
  public readonly requestId?: string;
  public readonly raw?: unknown;

  public constructor(message: string, init: {
    status: number;
    code?: number;
    details?: unknown;
    rateLimit?: ArenaRateLimit;
    requestId?: string;
    raw?: unknown;
  }) {
    super(message);
    this.status = init.status;
    this.code = init.code;
    this.details = init.details;
    this.rateLimit = init.rateLimit;
    this.requestId = init.requestId;
    this.raw = init.raw;
  }
}
