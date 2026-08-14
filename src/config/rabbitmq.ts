import dotenv from 'dotenv';

dotenv.config();

export const rabbitmqConfig = {
  url: process.env.RABBITMQ_URL || 'amqp://localhost',
  queues: {
    monitorChecks: 'monitor-checks',
    monitorChecksDLQ: 'monitor-checks.dlq',
    notifications: 'notifications',
    logs: 'logs',
  },
  prefetch: 1,
  reconnectDelay: 5000,
};