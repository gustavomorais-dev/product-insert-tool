import { IPackModel } from '../interfaces/packs/Pack.model.interface';
import SequelizePack from '../database/models/Pack.sequelize.model';
import IPack from '../interfaces/packs/Pack.interface';

export default class PackModel implements IPackModel {
  private model = SequelizePack;

  async findById(packId_: bigint): Promise<IPack[]> {
    const dbData = await this.model.findAll({ where: { packId: packId_ } });

    return dbData;
  }
}
