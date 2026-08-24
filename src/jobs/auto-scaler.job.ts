import cron from 'node-cron';
import chalk from 'chalk';
import { QueueService } from '../queue/queue.service.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class AutoScalerJob {
  private currentWorkers = 1;
  private readonly MIN_WORKERS = 1;
  private readonly MAX_WORKERS = 20;

  constructor(private queueService: QueueService) {}

  start(): void {
    // A cada 30 segs verifca se é preciso escalar 
    cron.schedule('*/30 * * * * *', async () => {
      await this.checkAndScale();
    });

    setTimeout(() => this.checkAndScale(), 5000);
  }

  private async checkAndScale(): Promise<void> {
    try {
      // Verifica o tamanho da fila no rabbitmq
      const queueSize = await this.getQueueSize();
      
      // Calcula quantos workers são necessários
      const desiredWorkers = this.calculateWorkers(queueSize);
      
      // Se mudou, escala
      if (desiredWorkers !== this.currentWorkers) {
        console.log(chalk.yellow(`
        ═══════════════════════════════════════════════════════
        📊 Tamanho da fila: ${queueSize} mensagens
        👥 Workers atuais: ${this.currentWorkers}
        🎯 Workers desejados: ${desiredWorkers}
        ═══════════════════════════════════════════════════════
        `));

        await this.scaleWorkers(desiredWorkers);
        this.currentWorkers = desiredWorkers;
      } else {
        console.log(chalk.gray(`Filas ok (${queueSize} msgs) - ${this.currentWorkers} workers`));
      }

    } catch (error) {
      console.error(chalk.red('Erro no auto-scaler:'), error);
    }
  }

  private async getQueueSize(): Promise<number> {
    try {
      const channel = await this.queueService.getChannel();
      const queue = await channel.checkQueue('monitor-checks');
      return queue.messageCount;
    } catch (error) {
      console.error(chalk.red('Erro ao verificar fila:'), error);
      return 0;
    }
  }

  private calculateWorkers(queueSize: number): number {
    // Regras de escalonamento
    if (queueSize === 0) {
      return this.MIN_WORKERS;
    }

    // Cada worker processa 10 mensagens por ciclo
    // Se tem 100 mensagens, precisa de 10 workers
    let workers = Math.ceil(queueSize / 10);

    // Limita entre MIN e MAX
    workers = Math.max(workers, this.MIN_WORKERS);
    workers = Math.min(workers, this.MAX_WORKERS);

    return workers;
  }

  private async scaleWorkers(count: number): Promise<void> {
    console.log(chalk.blue(`📈 Escalando para ${count} workers...`));

    try {
      // Comando Docker Compose
      const command = `docker-compose -f docker/docker-compose.yml up -d --scale api=1 --scale worker=${count}`;      
      const { stdout, stderr } = await execAsync(command);
      
      if (stderr) {
        console.error(chalk.red('Erro ao escalar:'), stderr);
      } else {
        console.log(chalk.green(`Escalado para ${count} workers com sucesso!`));
        console.log(chalk.gray(stdout));
      }

    } catch (error) {
      console.error(chalk.red('Erro ao executar docker-compose:'), error);
    }
  }
}