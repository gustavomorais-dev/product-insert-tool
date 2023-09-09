import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import db from '.';
import SequelizeProduct from './Product.sequelize.model';

class SequelizePack extends Model<InferAttributes<SequelizePack>,
InferCreationAttributes<SequelizePack>> {
  declare id: bigint;

  declare packId: bigint;

  declare productId: bigint;

  declare qty: bigint;
}

SequelizePack.init({
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  packId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  productId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  qty: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'packs',
  timestamps: false,
  underscored: true,
});

SequelizePack.belongsTo(SequelizeProduct, { as: 'product', foreignKey: 'productId' });

export default SequelizePack;
