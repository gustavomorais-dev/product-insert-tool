import { Request, Response } from 'express';
import ProductService from '../services/Product.service';
import { ProductUpdateReq } from '../types/Product.types';

declare module 'express' {
  interface Request {
    productsToUpdate?: ProductUpdateReq[];
  }
}

export default class UserController {
  constructor(
    private productService = new ProductService(),
  ) { }

  public async getValidations(req: Request, res: Response) {
    if (req.productsToUpdate === undefined) {
      return res.status(500).json({ message: 'productsToUpdate is undefined' });
    }

    const serviceResponse = await this.productService.getValidations(req.productsToUpdate);
    res.status(200).json(serviceResponse.data);
  }
}
