import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import db from '.';

class SequelizeProduct extends Model<InferAttributes<SequelizeProduct>,
InferCreationAttributes<SequelizeProduct>> {
  declare code: bigint;

  declare name: string;

  declare costPrice: number;

  declare salesPrice: number;
}

SequelizeProduct.init({
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
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
  },
  salesPrice: {
    type: DataTypes.DECIMAL(9, 2),
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'products',
  timestamps: false,
  underscored: true,
});

export default SequelizeProduct;
