import express from 'express';
import { getUsers, getUser, updateUser } from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/roles.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/:id', updateUser);

export default router;

