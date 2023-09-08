import { Model, QueryInterface, DataTypes } from 'sequelize';
import IPack from '../../interfaces/packs/Pack.interface';

export default {
  up(queryInterface: QueryInterface) {
    return queryInterface.createTable<Model<IPack>>('packs', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      packId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'pack_id',
        references: {
          model: 'products',
          key: 'code',
        },
      },
      productId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'product_id',
        references: {
          model: 'products',
          key: 'code',
        },
      },
      qty: {
        type: DataTypes.BIGINT,
        allowNull: false,
      }
    });
  },
  down(queryInterface: QueryInterface) {
    return queryInterface.dropTable('packs');
  },
};