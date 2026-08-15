export interface LogBase {
  monitorId: number;
  url: string;
  isUp: boolean;
  statusCode: number | null;
  responseTimeMs: number | null;
  errorMessage: string | null;
  checkedAt: Date;
}

export interface InputLog extends LogBase {
  id?: number;
}

export interface Log extends LogBase {
  id: number;
}