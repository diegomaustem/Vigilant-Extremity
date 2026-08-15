import cron from 'node-cron';
import type { ScheduledTask } from 'node-cron';
import chalk from 'chalk';
import { MonitorService } from '../modules/monitor/monitor.service.js';
import { MonitorCheckProducer } from '../queue/producers/monitor-check.producer.js';
import { LogRepository } from '../modules/logs/log.repository.js';
import { PeriodicityRepository } from '../modules/periodicity/periodicity.repository.js';

export class MonitorSchedulerJob {
  private task: ScheduledTask | null = null;

  constructor(
    private monitorService: MonitorService,
    private producer: MonitorCheckProducer,
    private logRepository: LogRepository,
    private periodicityRepository: PeriodicityRepository
  ) {}

  start(): void {
    if (this.task) {
      console.log(chalk.yellow('Scheduler já está rodando.'));
      return;
    }

    this.task = cron.schedule('*/10 * * * * *', async () => {
      try {
        const monitors = await this.monitorService.getAll();
        const toSchedule: number[] = [];

        for (const monitor of monitors) {
          const needsCheck = await this.needsCheck(monitor);
          if (needsCheck) {
            toSchedule.push(monitor.id);
          }
        }

        if (toSchedule.length > 0) {
          console.log(chalk.blue(`Agendando ${toSchedule.length} monitores...`));
          await this.producer.scheduleBatch(toSchedule);
        }

      } catch (error) {
        console.error(chalk.red('Erro no scheduler:'), error);
      }
    });

    console.log(chalk.green('Monitor Scheduler iniciado!'));
  }

  stop(): void {
    if (this.task) {
      this.task.stop();
      this.task = null;
      console.log(chalk.yellow('Monitor Scheduler parado'));
    }
  }

  private async needsCheck(monitor: any): Promise<boolean> {
    try {
      const lastLog = await this.logRepository.getLogByMonitorId(monitor.id);

      if (!lastLog) {
        return true;
      }

      const periodicity = await this.periodicityRepository.getById(monitor.periodicityId);
      const intervalMs = this.parsePeriodicityToMs(periodicity.time);
      const lastCheckTime = new Date(lastLog.checkedAt).getTime();
      const nextCheckTime = lastCheckTime + intervalMs;
      
      return Date.now() >= nextCheckTime;
      
    } catch (error) {
      console.error(`Erro ao verificar monitor ${monitor.id}:`, error);
      return true;
    }
  }

  private parsePeriodicityToMs(time: string): number {
    const unit = time.slice(-1);
    const value = parseInt(time.slice(0, -1), 10);
    
    switch (unit) {
      case 'M': return value * 60 * 1000;
      case 'H': return value * 60 * 60 * 1000;
      case 'D': return value * 24 * 60 * 60 * 1000; 
      default: return 5 * 60 * 1000;
    }
  }
}