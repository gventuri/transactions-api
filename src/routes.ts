import express from 'express';

// Controllers
import UsersController from './controllers/UsersController';

const router = express.Router();

// USERS
router.get(
  '/users/:id/merchants_with_percentile',
  UsersController.getMerchantsWithPercentile
);

export default router;
