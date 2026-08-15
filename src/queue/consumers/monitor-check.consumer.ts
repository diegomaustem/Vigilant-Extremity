import chalk from 'chalk';
import { QueueService } from '../queue.service.js';
import { rabbitmqConfig } from '../../config/rabbitmq.js';
import { MonitorService } from '../../modules/monitor/monitor.service.js';
import { UrlConsultantService } from '../../services/url-consultant.service.js';
import type { MonitorCheckMessage } from '../queue.types.js';

export class MonitorCheckConsumer {
  private isRunning = false;

  constructor(
    private queueService: QueueService,
    private monitorService: MonitorService,
    private urlConsultantService: UrlConsultantService
  ) {}

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log(chalk.yellow('Consumer em execução.'));
      return;
    }

    this.isRunning = true;
    console.log(chalk.blue('Iniciando consumer de verificações.'));

    await this.queueService.consume<MonitorCheckMessage>(
      rabbitmqConfig.queues.monitorChecks,
      async (message) => {
        const { monitorId } = message;

        try {
          const monitor = await this.monitorService.getById(monitorId);
          const result = await this.urlConsultantService.checkAddress(monitor);

          if (result.wasChecked) {
            console.log(chalk.green(`Monitor ${monitorId} verificado com sucesso.`));
          } else {
            console.log(chalk.gray(`Monitor ${monitorId} já foi verificado recentemente.`));
          }

        } catch (error: any) {
          console.error(chalk.red(`Erro ao verificar monitor ${monitorId}:`), error.message);
          throw error; // Rejeita a mensagem (vai para DLQ)
        }
      }
    );
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    console.log(chalk.yellow('Consumer de verificações parado.'));
  }
}