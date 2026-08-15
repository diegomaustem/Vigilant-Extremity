export interface MonitorBase {
  userId: number;
  periodicityId: number;
  name: string;
  description: string;
  url: string;
}

export interface InputMonitor extends MonitorBase {}

export interface Monitor extends MonitorBase {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}