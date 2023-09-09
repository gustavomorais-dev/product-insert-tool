/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-lines-per-function */
import ProductModel from '../models/Product.model';
import { IProductModel } from '../interfaces/products/Product.model.interface';
import { ServiceResponse } from '../interfaces/ServiceResponse';
import { ProductUpdateReq } from '../types/Product.types';
import { IPackModel } from '../interfaces/packs/Pack.model.interface';
import PackModel from '../models/Pack.model';
import { ReturnData, ReturnElement } from '../types/Return.types';

export default class ProductService {
  constructor(
    private productModel: IProductModel = new ProductModel(),
    private packModel: IPackModel = new PackModel(),
  ) { }

  private async findNonExistentProducts(
    productsToUpdate: ProductUpdateReq[],
  ): Promise<ProductUpdateReq[]> {
    const productExistencePromises = productsToUpdate.map(async (product) => {
      const productExist = await this.productModel.findByCode(BigInt(product.productId));
      return { product, exists: !!productExist };
    });

    const nonExistentProducts = (await Promise.all(productExistencePromises)).filter(
      (item) => !item.exists,
    );

    return nonExistentProducts.map((item) => item.product);
  }

  private async findInvalidProductPrices(
    productsToUpdate: ProductUpdateReq[],
  ): Promise<ProductUpdateReq[]> {
    const invalidPriceProductsPromises = productsToUpdate.map(async (product) => {
      const productCode = BigInt(product.productId);
      const productFromDB = await this.productModel.findByCode(productCode);
      if (productFromDB && productFromDB.costPrice >= product.newPrice) {
        return product;
      }
      return null;
    });

    const invalidPriceProducts = await Promise.all(invalidPriceProductsPromises);

    return invalidPriceProducts.filter((product) => product !== null) as ProductUpdateReq[];
  }

  private async findInvalidProductPricesDiff(
    productsToUpdate: ProductUpdateReq[],
  ): Promise<ProductUpdateReq[]> {
    const productCodesToUpdate = productsToUpdate.map((product) => BigInt(product.productId));
    const productsFromDB = await this.productModel.findByCodes(productCodesToUpdate);

    const productMap = new Map(productCodesToUpdate.map(
      (code, index) => [code, productsFromDB[index]],
    ));

    const invalidPriceProducts = productsToUpdate.filter((product) => {
      const productCode = BigInt(product.productId);
      const productFromDB = productMap.get(productCode);

      if (productFromDB) {
        const priceDifference = Math.abs(product.newPrice - productFromDB.salesPrice);
        const priceChangeLimit = productFromDB.salesPrice * 0.1;

        return priceDifference > priceChangeLimit;
      }

      return false;
    });

    return invalidPriceProducts;
  }

  private async findInvalidPacksAndProducts(productsToUpdate: ProductUpdateReq[])
    : Promise<ProductUpdateReq[]> {
    const invalidProducts: ProductUpdateReq[] = [];

    await Promise.all(productsToUpdate.map(async (productToUpdate) => {
      const isAPack = await this.packModel.findById(BigInt(productToUpdate.productId));

      if (isAPack.length > 0) {
        const packDetails = await this.packModel.findById(BigInt(productToUpdate.productId));
        const pricesProductsShouldHavePromises = packDetails.map(async (pack) => {
          const product = await this.productModel.findByCode(pack.productId);
          return {
            id: product?.code,
            price: (Number(productToUpdate.newPrice) / Number(pack.qty)),
          };
        });

        const pricesProductsShouldHave = await Promise.all(pricesProductsShouldHavePromises);

        console.log('sohuld = ', pricesProductsShouldHave);

        let found = false;

        productsToUpdate.forEach((element) => {
          console.log('it ');

          if (!found) {
            found = pricesProductsShouldHave.some((p) => {
              const productIdMatch = Number(p.id) === Number(element.productId);
              const priceMatch = p.price.toFixed(2) === element.newPrice.toFixed(2);

              console.log(`Debug: productId=${p.id}, element=${element.productId}`);
              console.log(`Debug: productIdMatch=${productIdMatch}, priceMatch=${priceMatch}`);

              return productIdMatch && priceMatch;
            });
          }
        });

        if (!found) {
          invalidProducts.push(productToUpdate);
        }
      }
    }));

    return invalidProducts;
  }

  public async getValidations(
    productsToUpdate: ProductUpdateReq[],
  ): Promise<ServiceResponse<ReturnData>> {
    const nonExistentProducts = await this.findNonExistentProducts(productsToUpdate);
    const invalidProductPrices = await this.findInvalidProductPrices(productsToUpdate);
    const invalidProductPricesDiff = await this.findInvalidProductPricesDiff(productsToUpdate);
    const invalidPacksAndProducts = await this.findInvalidPacksAndProducts(productsToUpdate);

    const promises: Promise<ReturnElement>[] = [];

    for (const product of productsToUpdate) {
      const promise = this.validateProduct(product, [
        nonExistentProducts,
        invalidProductPrices,
        invalidProductPricesDiff,
        invalidPacksAndProducts,
      ]);
      promises.push(promise);
    }

    const dataToSend = await Promise.all(promises);

    console.log(dataToSend);

    return { status: 'SUCCESSFUL', data: dataToSend };
  }

  private async validateProduct(
    product: ProductUpdateReq,
    validationDataArray: [
      ProductUpdateReq[],
      ProductUpdateReq[],
      ProductUpdateReq[],
      ProductUpdateReq[],
    ],
  ): Promise<ReturnElement> {
    const [
      nonExistentProducts,
      invalidProductPrices,
      invalidProductPricesDiff,
      invalidPacksAndProducts,
    ] = validationDataArray;

    const productFromDB = await this.productModel.findByCode(BigInt(product.productId));

    if (!productFromDB) {
      return {
        code: 0,
        name: '',
        price: 0,
        newPrice: 0,
        errors: [],
      };
    }

    const data: ReturnElement = {
      code: Number(productFromDB.code),
      name: productFromDB.name,
      price: productFromDB.salesPrice,
      newPrice: product.newPrice,
      errors: [],
    };

    if (nonExistentProducts.find((p) => Number(p.productId) === Number(product.productId))) {
      data.errors.push('Non-existent product code.');
    }

    if (invalidProductPrices.find((p) => Number(p.productId) === Number(product.productId))) {
      data.errors.push('The new price cannot be greater than the cost of the product.');
    }

    if (invalidProductPricesDiff.find((p) => Number(p.productId) === Number(product.productId))) {
      data.errors.push(
        'Readjustment cannot be greater or less than 10% of the current price of the product.',
      );
    }

    if (invalidPacksAndProducts.find((p) => Number(p.productId) === Number(product.productId))) {
      data.errors.push(
        'When altering pack price, you must also adjust the prices of the included products.',
      );
    }

    return data;
  }
}
