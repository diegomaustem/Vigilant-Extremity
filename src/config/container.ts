import knex from 'knex';
import type { Knex } from 'knex';
import dbConfig from '../database/dbConfig.js';
import { MonitorRepository } from '../modules/monitor/monitor.repository.js';
import { MonitorService } from '../modules/monitor/monitor.service.js';
import { MonitorController } from '../modules/monitor/monitor.controller.js';
import { PeriodicityRepository } from '../modules/periodicity/periodicity.repository.js';
import { PeriodicityService } from '../modules/periodicity/periodicity.service.js';
import { PeriodicityController } from '../modules/periodicity/periodicity.controller.js';
import { UrlConsultantService } from '../services/url-consultant.service.js';
import { LogRepository } from '../modules/logs/log.repository.js';
import { UserRepository } from '../modules/user/user.repository.js';
import { AuthService } from '../modules/auth/auth.service.js';
import { AuthController } from '../modules/auth/auth.controller.js';
import { UserService } from '../modules/user/user.service.js';
import { UserController } from '../modules/user/user.controller.js';
import { LogService } from '../modules/logs/log.service.js';
import { LogController } from '../modules/logs/log.controller.js';
import { RoleRepository } from '../modules/role/role.repository.js';
import { RoleService } from '../modules/role/role.service.js';
import { RoleController } from '../modules/role/role.controller.js';

import { QueueService } from '../queue/queue.service.js';
import { MonitorCheckProducer } from '../queue/producers/monitor-check.producer.js';
import { MonitorCheckConsumer } from '../queue/consumers/monitor-check.consumer.js';
import { MonitorSchedulerJob } from '../jobs/monitor-scheduler.job.js';


class DependencyContainer {
  private static dbCache: Knex | null = null;

  private static monitorRepositoryCache: MonitorRepository | null = null;
  private static monitorServiceCache: MonitorService | null = null;
  private static monitorControllerCache: MonitorController | null = null;

  private static periodicityRepositoryCache: PeriodicityRepository | null = null;
  private static periodicityServiceCache: PeriodicityService | null = null;
  private static periodicityControllerCache: PeriodicityController | null = null;

  private static logRepositoryCache: LogRepository | null = null;
  private static logServiceCache: LogService | null = null;
  private static logControllerCache: LogController | null = null;
  
  private static urlConsultantServiceCache: UrlConsultantService | null = null;

  private static userRepositoryCache: UserRepository | null = null;
  private static userServiceCache: UserService | null = null;
  private static userControllerCache: UserController | null = null;

  private static authServiceCache: AuthService | null = null;
  private static authControllerCache: AuthController | null = null;

  private static roleRepositoryCache: RoleRepository | null = null;
  private static roleServiceCache: RoleService | null = null;
  private static roleControllerCache: RoleController | null = null;

  // RabbitMQ
  private static queueServiceCache: QueueService | null = null;
  private static monitorCheckProducerCache: MonitorCheckProducer | null = null;
  private static monitorCheckConsumerCache: MonitorCheckConsumer | null = null;
  private static monitorSchedulerJobCache: MonitorSchedulerJob | null = null;

  public static get db(): Knex {
    if (!this.dbCache) {
      const config = dbConfig;
      if(!config) {
        const currentEnv = process.env.NODE_ENV || 'não definido';
        throw new Error(`Configuração do banco não encontrada para o ambiente ${currentEnv}`);
      }
      this.dbCache = knex(config);
    }
    return this.dbCache;
  }

  public static get monitorRepository(): MonitorRepository {
    if (!this.monitorRepositoryCache) {
      this.monitorRepositoryCache = new MonitorRepository(this.db);
    }
    return this.monitorRepositoryCache;
  }

  public static get monitorService(): MonitorService {
    if (!this.monitorServiceCache) {
      this.monitorServiceCache = new MonitorService(this.monitorRepository);
    }
    return this.monitorServiceCache;
  }

  public static get monitorController(): MonitorController {
    if (!this.monitorControllerCache) {
      this.monitorControllerCache = new MonitorController(this.monitorService);
    }
    return this.monitorControllerCache;
  }

  public static get periodicityRepository(): PeriodicityRepository {
    if (!this.periodicityRepositoryCache) {
      this.periodicityRepositoryCache = new PeriodicityRepository(this.db);
    }
    return this.periodicityRepositoryCache;
  }

  public static get periodicityService(): PeriodicityService {
    if (!this.periodicityServiceCache) {
      this.periodicityServiceCache = new PeriodicityService(this.periodicityRepository, this.monitorRepository);
    }
    return this.periodicityServiceCache;
  }

  public static get periodicityController(): PeriodicityController {
    if (!this.periodicityControllerCache) {
      this.periodicityControllerCache = new PeriodicityController(this.periodicityService);
    }
    return this.periodicityControllerCache;
  }

  public static get logRepository(): LogRepository {
    if (!this.logRepositoryCache) {
      this.logRepositoryCache = new LogRepository(this.db);
    }
    return this.logRepositoryCache;
  }

  public static get logService(): LogService {
    if (!this.logServiceCache) {
      this.logServiceCache = new LogService(this.logRepository);
    }
    return this.logServiceCache;
  }

  public static get logController(): LogController {
    if (!this.logControllerCache) {
      this.logControllerCache = new LogController(this.logService);
    }
    return this.logControllerCache;
  }

  public static get urlConsultantService(): UrlConsultantService {
    if (!this.urlConsultantServiceCache) {
      this.urlConsultantServiceCache = new UrlConsultantService(this.logRepository, this.periodicityRepository);
    }
    return this.urlConsultantServiceCache;
  }

  public static get userRepository(): UserRepository {
    if (!this.userRepositoryCache) {
      this.userRepositoryCache = new UserRepository(this.db);
    }
    return this.userRepositoryCache;
  }

  public static get userService(): UserService {
    if (!this.userServiceCache) {
      this.userServiceCache = new UserService(this.userRepository);
    }
    return this.userServiceCache;
  }

  public static get userController(): UserController {
    if (!this.userControllerCache) {
      this.userControllerCache = new UserController(this.userService);
    }
    return this.userControllerCache;
  }

  public static get authService(): AuthService {
    if (!this.authServiceCache) {
      this.authServiceCache = new AuthService(this.userRepository);
    }
    return this.authServiceCache;
  }

  public static get authController(): AuthController {
    if (!this.authControllerCache) {
      this.authControllerCache = new AuthController(this.authService);
    }
    return this.authControllerCache;
  }

  public static get roleRepository(): RoleRepository {
    if (!this.roleRepositoryCache) {
      this.roleRepositoryCache = new RoleRepository(this.db);
    }
    return this.roleRepositoryCache;
  }

  public static get roleService(): RoleService {
    if (!this.roleServiceCache) {
      this.roleServiceCache = new RoleService(this.roleRepository);
    }
    return this.roleServiceCache;
  }

  public static get roleController(): RoleController {
    if (!this.roleControllerCache) {
      this.roleControllerCache = new RoleController(this.roleService);
    }
    return this.roleControllerCache;
  }

  // RABBITMQ
  public static get queueService(): QueueService {
    if (!this.queueServiceCache) {
      this.queueServiceCache = new QueueService();
    }
    return this.queueServiceCache;
  }

  public static get monitorCheckProducer(): MonitorCheckProducer {
    if (!this.monitorCheckProducerCache) {
      this.monitorCheckProducerCache = new MonitorCheckProducer(this.queueService);
    }
    return this.monitorCheckProducerCache;
  }

  public static get monitorCheckConsumer(): MonitorCheckConsumer {
    if (!this.monitorCheckConsumerCache) {
      this.monitorCheckConsumerCache = new MonitorCheckConsumer(
        this.queueService,
        this.monitorService,
        this.urlConsultantService
      );
    }
    return this.monitorCheckConsumerCache;
  }

  public static get monitorSchedulerJob(): MonitorSchedulerJob {
    if (!this.monitorSchedulerJobCache) {
      this.monitorSchedulerJobCache = new MonitorSchedulerJob(
        this.monitorService,
        this.monitorCheckProducer,
        this.logRepository, 
      this.periodicityRepository 
      );
    }
    return this.monitorSchedulerJobCache;
  }

  public static async destroyRabbitMQ(): Promise<void> {
    if (this.queueServiceCache) {
      await this.queueServiceCache.close();
      this.queueServiceCache = null;
    }
  }

  public static async destroyAll(): Promise<void> {
    await this.destroyDb();
    await this.destroyRabbitMQ();
  }

  public static async destroyDb(): Promise<void> {
    if (this.dbCache) {
      await this.dbCache.destroy();
      this.dbCache = null;
    }
  }
}

export const db = DependencyContainer.db;

export const monitorController = DependencyContainer.monitorController;
export const monitorService = DependencyContainer.monitorService;
export const monitorRepository = DependencyContainer.monitorRepository;

export const periodicityController = DependencyContainer.periodicityController;
export const periodicityService = DependencyContainer.periodicityService;
export const periodicityRepository = DependencyContainer.periodicityRepository;

export const logRepository = DependencyContainer.logRepository;
export const logServicee = DependencyContainer.logService;
export const logController = DependencyContainer.logController;

export const urlConsultantService = DependencyContainer.urlConsultantService;

export const userRepository = DependencyContainer.userRepository;
export const userService = DependencyContainer.userService;
export const userController = DependencyContainer.userController;

export const authController = DependencyContainer.authController;
export const authService = DependencyContainer.authService;

export const roleRepository = DependencyContainer.roleRepository;
export const roleService = DependencyContainer.roleService;
export const roleController = DependencyContainer.roleController;

export const queueService = DependencyContainer.queueService;
export const monitorCheckProducer = DependencyContainer.monitorCheckProducer;
export const monitorCheckConsumer = DependencyContainer.monitorCheckConsumer;
export const monitorSchedulerJob = DependencyContainer.monitorSchedulerJob;

export default DependencyContainer;