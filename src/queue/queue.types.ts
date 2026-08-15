// Tipos de mensagens suportadas
export type MessageType = 
  | 'MONITOR_CHECK'
  | 'MONITOR_UP'
  | 'MONITOR_DOWN'
  | 'NOTIFICATION'
  | 'LOG_BATCH';

// Base de todas as mensagens
export interface BaseMessage {
  type: MessageType;
  timestamp?: string;
}

// Mensagem de verificação de monitor
export interface MonitorCheckMessage extends BaseMessage {
  type: 'MONITOR_CHECK';
  monitorId: number;
  scheduledAt: string;
}

// Mensagem de notificação
export interface NotificationMessage extends BaseMessage {
  type: 'MONITOR_UP' | 'MONITOR_DOWN';
  monitorId: number;
  url: string;
  userId: number;
  status: boolean;
  timestamp: string;
}

// Mensagem de log em lote
export interface LogBatchMessage extends BaseMessage {
  type: 'LOG_BATCH';
  logs: Array<{
    monitorId: number;
    url: string;
    isUp: boolean;
    statusCode: number | null;
    responseTimeMs: number | null;
    errorMessage: string | null;
    checkedAt: string;
  }>;
}

// Union de todas as mensagens
export type QueueMessage = 
  | MonitorCheckMessage
  | NotificationMessage
  | LogBatchMessage;

// Opções de publicação
export interface PublishOptions {
  persistent?: boolean;
  priority?: number;
  expiration?: number | string;
  headers?: Record<string, string | number | boolean>;
}