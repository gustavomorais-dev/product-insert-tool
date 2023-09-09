import IPack from './Pack.interface';

export interface IPackModel {
  findById(id: IPack['packId']): Promise<IPack[]>,
}
