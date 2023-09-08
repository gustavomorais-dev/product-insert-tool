import { Model, QueryInterface, DataTypes } from 'sequelize';
import IProduct from '../../interfaces/products/Product.interface';

export default {
  up(queryInterface: QueryInterface) {
    return queryInterface.createTable<Model<IProduct>>('products', {
      code: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      costPrice: {
        type: DataTypes.DECIMAL(9,2),
        allowNull: false,
        field: 'cost_price',
      },
      salesPrice: {
        type: DataTypes.DECIMAL(9,2),
        allowNull: false,
        field: 'sales_price',
      },
    });
  },
  down(queryInterface: QueryInterface) {
    return queryInterface.dropTable('products');
  },
};