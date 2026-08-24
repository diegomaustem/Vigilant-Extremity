import chalk from 'chalk';
import dotenv from 'dotenv';
import { queueService } from './config/container.js';
import { AutoScalerJob } from './jobs/auto-scaler.job.js';

dotenv.config();

async function startAutoScaler() {
  console.log(chalk.blue('🚀 Iniciando Auto-Scaler...'));

  try {
    // Conecta ao RabbitMQ
    await queueService.connect();

    // Inicia o Auto-Scaler
    const autoScaler = new AutoScalerJob(queueService);
    autoScaler.start();

    console.log(chalk.green('✅ Auto-Scaler está rodando!'));

    // Mantém o processo vivo
    process.on('SIGINT', async () => {
      console.log(chalk.yellow('\n Encerrando Auto-Scaler...'));
      await queueService.close();
      process.exit(0);
    });

  } catch (error) {
    console.error(chalk.red('Erro ao iniciar Auto-Scaler:'), error);
    process.exit(1);
  }
}

startAutoScaler();