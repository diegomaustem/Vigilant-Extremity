import { QueueService } from '../queue.service.js';
import { rabbitmqConfig } from '../../config/rabbitmq.js';
import type { MonitorCheckMessage } from '../queue.types.js';

export class MonitorCheckProducer {
  constructor(private queueService: QueueService) {}

  async scheduleCheck(monitorId: number): Promise<void> {
    const message: MonitorCheckMessage = {
      type: 'MONITOR_CHECK',
      monitorId,
      scheduledAt: new Date().toISOString(),
    };

    await this.queueService.publish(
      rabbitmqConfig.queues.monitorChecks,
      message
    );
  }

  async scheduleBatch(monitorIds: number[]): Promise<void> {
    const promises = monitorIds.map(id => this.scheduleCheck(id));
    await Promise.all(promises);
  }
}