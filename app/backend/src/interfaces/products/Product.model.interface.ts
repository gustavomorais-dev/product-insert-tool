import IProduct from './Product.interface';

export interface IProductModel {
  // findAll(): Promise<IProduct[]>,
  findByCode(code: IProduct['code']): Promise<IProduct | null>,
  findByCodes(code: IProduct['code'][]): Promise<IProduct[]>,
}
