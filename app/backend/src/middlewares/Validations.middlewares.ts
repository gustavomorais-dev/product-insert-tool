import { NextFunction, Request, Response } from 'express';
import { ProductUpdateReq } from '../types/Product.types';

declare module 'express' {
  interface Request {
    productsToUpdate?: ProductUpdateReq[];
  }
}

class Validations {
  static async validateFields(req: Request, res: Response, next: NextFunction)
    : Promise<Response | void> {
    const { productsToUpdate } = req;

    // productsToUpdate is a not empty array
    if (!Array.isArray(productsToUpdate) || productsToUpdate.length === 0) {
      return res.status(400).json({ error: 'You must enter at least one product' });
    }

    // Checks if all elements in the array meet the criteria
    const isValid = productsToUpdate.every((product: { productId: number, newPrice: number }) => (
      typeof product === 'object'
      && typeof product.productId === 'number' // First key is a number
      && typeof product.newPrice === 'number' // Second key is a number
      && /^\d+\.\d{2}$/.test(product.newPrice.toFixed(2)) // Second column has 2 decimal places
    ));

    if (!isValid) {
      return res.status(400).json({ error: 'Incorrect data in some of these inserts.' });
    }

    next();
  }
}

export default Validations;
