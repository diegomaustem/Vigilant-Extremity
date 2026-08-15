import amqp from 'amqplib';
import type { Channel, ChannelModel } from 'amqplib';
import chalk from 'chalk';
import { rabbitmqConfig } from '../config/rabbitmq.js';
import type { PublishOptions, QueueMessage } from './queue.types.js';

export class QueueService {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private isConnected = false;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor() {}

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(rabbitmqConfig.url);
      this.channel = await this.connection.createChannel();

      await this.channel.prefetch(rabbitmqConfig.prefetch);
      await this.createQueues();

      this.isConnected = true;
      console.log(chalk.green('RabbitMQ conectado com sucesso.'));

      // Monitora a conexão
      this.connection.on('close', () => {
        this.isConnected = false;
        console.log(chalk.yellow('Conexão com RabbitMQ fechada.'));
        this.reconnect();
      });

      this.connection.on('error', (error) => {
        console.error(chalk.red('Erro no RabbitMQ:'), error);
      });

    } catch (error) {
      console.error(chalk.red('Erro ao conectar RabbitMQ:'), error);
      this.reconnect();
    }
  }

  private async createQueues(): Promise<void> {
    if (!this.channel) return;

    const { monitorChecks, monitorChecksDLQ, notifications, logs } = rabbitmqConfig.queues;

    // Fila principal
    await this.channel.assertQueue(monitorChecks, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': monitorChecksDLQ,
      },
    });

    // Fila mensagens que falharam
    await this.channel.assertQueue(monitorChecksDLQ, {
      durable: true,
    });

    // Fila de notificações
    await this.channel.assertQueue(notifications, {
      durable: true,
    });

    // Fila de logs
    await this.channel.assertQueue(logs, {
      durable: true,
    });
  }

  private reconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = setTimeout(() => {
      console.log(chalk.yellow(`Tentando reconectar ao RabbitMQ em ${rabbitmqConfig.reconnectDelay / 1000}s...`));
      this.connect();
    }, rabbitmqConfig.reconnectDelay);
  }

  async publish(
    queue: string, 
    message: QueueMessage, 
    options: PublishOptions = { persistent: true }
  ): Promise<void> {
    if (!this.isConnected || !this.channel) {
      throw new Error('RabbitMQ não está conectado');
    }

    const content = Buffer.from(JSON.stringify({
      ...message,
      publishedAt: new Date().toISOString(),
    }));

    this.channel.sendToQueue(queue, content, {
      persistent: options.persistent ?? true,
    });
  }

  async consume<T extends QueueMessage = QueueMessage>(
    queue: string,
    callback: (message: T) => Promise<void>
  ): Promise<void> {
    if (!this.isConnected || !this.channel) {
      throw new Error('RabbitMQ não está conectado.');
    }

    await this.channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        const content = JSON.parse(msg.content.toString()) as T;
        await callback(content);
        this.channel!.ack(msg);
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        this.channel!.nack(msg, false, false);
      }
    });
  }

  async getChannel(): Promise<Channel> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel não disponível');
    }
    return this.channel;
  }

  async close(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
    this.isConnected = false;
  }
}