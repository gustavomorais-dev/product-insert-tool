import { Router } from 'express';
import fileRouter from './File.routes';

const router = Router();

router.use('/file', fileRouter);

export default router;
