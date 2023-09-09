import { Request, Router, Response } from 'express';
import multer = require('multer');
import FileController from '../controllers/File.controller';
import File from '../middlewares/File.middlewares';
import Validations from '../middlewares/Validations.middlewares';

const fileController = new FileController();

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  '/validate',
  upload.single('file'),
  File.read,
  Validations.validateFields,
  (req: Request, res: Response) => fileController.getValidations(req, res),
);

export default router;
