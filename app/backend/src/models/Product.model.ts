import IProduct from '../interfaces/products/Product.interface';
import SequelizeProduct from '../database/models/Product.sequelize.model';
import { IProductModel } from '../interfaces/products/Product.model.interface';

export default class ProductModel implements IProductModel {
  private model = SequelizeProduct;

  async findByCode(code_: bigint): Promise<IProduct | null> {
    const dbData = await this.model.findByPk(code_);
    if (dbData == null) return null;

    const { code, name, costPrice, salesPrice }: IProduct = dbData;
    return { code, name, costPrice, salesPrice };
  }

  async findByCodes(codes: bigint[]): Promise<IProduct[]> {
    const dbData = await this.model.findAll({
      where: {
        code: codes,
      },
    });

    const products: IProduct[] = dbData.map((dbProduct) => {
      const { code, name, costPrice, salesPrice }: IProduct = dbProduct;
      return { code, name, costPrice, salesPrice };
    });

    return products;
  }
}
