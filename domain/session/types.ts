export type ActionOk<T extends Record<string, unknown> = Record<string, unknown>> = {
  ok: true;
} & T;

export type ActionErr = {
  ok: false;
  code: string;
  message: string;
};

export type ActionResult<T extends Record<string, unknown> = Record<string, unknown>> =
  | ActionOk<T>
  | ActionErr;

export const SessionErrorCode = {
  TABLE_NOT_FOUND: "TABLE_NOT_FOUND",
  SESSION_UNAVAILABLE: "SESSION_UNAVAILABLE",
  INVALID_INPUT: "INVALID_INPUT",
} as const;

export type SessionErrorCode =
  (typeof SessionErrorCode)[keyof typeof SessionErrorCode];
