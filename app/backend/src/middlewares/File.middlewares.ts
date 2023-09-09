import { NextFunction, Request, Response } from 'express';
import { ProductUpdateReq } from '../types/Product.types';

declare module 'express' {
  interface Request {
    productsToUpdate?: ProductUpdateReq[];
  }
}

class File {
  static async read(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo foi enviado.' });

    const content = req.file.buffer.toString('utf8');
    const finalContent: ProductUpdateReq[] = [];

    content.split('\n').forEach((line) => {
      const [productIdStr, newPriceStr] = line.split(',');
      const productId = parseInt(productIdStr, 10);
      const newPrice = parseFloat(newPriceStr);
      if (!Number.isNaN(productId) && !Number.isNaN(newPrice)) {
        finalContent.push({ productId, newPrice });
      }
    });

    req.productsToUpdate = finalContent;

    next();
  }
}

export default File;
