import { Router } from 'express';
import { asyncHandler } from '../middlewares/async-handler.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { loginLimiter, registerLimiter } from '../middlewares/rate-limit.middleware.js';
import { AuthValidator } from '../validators/auth-validator.js';

import { 
    authController, 
    logController, 
    monitorController, 
    roleController, 
    userController 
} from '../config/container.js';
import { MonitorValidator } from '../validators/monitor-validator.js';
import { periodicityController } from '../config/container.js';
import { PeriodicityValidator } from '../validators/periodicity-validator.js';
import { authService } from '../config/container.js';

const authGuard = authMiddleware(authService);
const router: Router = Router();

router.post('/register', registerLimiter, AuthValidator.validateRegister, asyncHandler(authController.register));
router.post('/login', loginLimiter, AuthValidator.validateLogin, asyncHandler(authController.login));

router.get('/monitors', authGuard, asyncHandler(monitorController.getAll));
router.get('/monitors-paginated', authGuard, asyncHandler(monitorController.getAllPaginated));
router.get('/monitor/:id', authGuard, asyncHandler(monitorController.getById));
router.post('/monitor', authGuard,MonitorValidator.validateCheckInput, asyncHandler(monitorController.create));
router.put('/monitor/:id', authGuard,MonitorValidator.validateCheckInput, asyncHandler(monitorController.update));
router.delete('/monitor/:id', asyncHandler(monitorController.delete));

router.get('/periodicities', authGuard, asyncHandler(periodicityController.getAll));
router.get('/periodicities-paginated', authGuard, asyncHandler(periodicityController.getAllPaginated));
router.get('/periodicity/:id', authGuard, asyncHandler(periodicityController.getById)); 
router.post('/periodicity', authGuard, PeriodicityValidator.validateCheckInput, asyncHandler(periodicityController.create));
router.put('/periodicity/:id', authGuard, PeriodicityValidator.validateCheckInput, asyncHandler(periodicityController.update));
router.delete('/periodicity/:id', authGuard, asyncHandler(periodicityController.delete));

router.get('/users', authGuard, asyncHandler(userController.getAll));
router.get('/users-paginated', authGuard, asyncHandler(userController.getAllPaginated));
router.get('/user/:id', authGuard, asyncHandler(userController.getById));
router.post('/user', authGuard, asyncHandler(userController.create));
router.put('/user/:id', authGuard, asyncHandler(userController.update));
router.delete('/user/:id', authGuard, asyncHandler(userController.delete));

router.get('/monitors-log', authGuard, asyncHandler(logController.getAll));
router.get('/monitors-log-paginated', authGuard, asyncHandler(logController.getAllPaginated));

router.get('/roles', authGuard, asyncHandler(roleController.getAll));

export default router;