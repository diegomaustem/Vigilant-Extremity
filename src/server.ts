import app from './app.js';
import chalk from 'chalk';
import dotenv from 'dotenv';
import {
  queueService,
  monitorCheckConsumer,
  monitorSchedulerJob,
} from './config/container.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await queueService.connect();
    await monitorCheckConsumer.start();

    monitorSchedulerJob.start();

    app.listen(PORT, () => {
      console.log(chalk.green(`Servidor rodando na porta ${PORT}`));
      console.log(chalk.green('RabbitMQ conectado.'));
      console.log(chalk.green('Consumer iniciado.'));
      console.log(chalk.green('Scheduler iniciado.'));
    });

  } catch (error) {
    console.error(chalk.red('Erro ao iniciar servidor:'), error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log(chalk.yellow('\n Encerrando servidor...'));
  await queueService.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log(chalk.yellow('\n Encerrando servidor (SIGTERM)...'));
  await queueService.close();
  process.exit(0);
});

startServer();