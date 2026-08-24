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

    // Executa work 1, que faz as funções de publicar e consumir do rabbit
    if (process.env.RUN_SCHEDULER === 'true') {
      monitorSchedulerJob.start();
      console.log(chalk.green('Scheduler iniciado - Worker 1'));
    } else {
      console.log(chalk.gray(`Scheduler desativado (Worker ${process.env.WORKER_ID || '?'})`));
    }

    app.listen(PORT, () => {
      console.log(chalk.green(`Servidor rodando na porta ${PORT}`));
      console.log(chalk.green(`Worker ID: ${process.env.WORKER_ID || '?'}`));
      console.log(chalk.green(`Scheduler: ${process.env.RUN_SCHEDULER === 'true' ? 'ATIVO' : 'DESATIVADO'}`));
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