import { BaseEntity } from './BaseEntity.js';

export class Song extends BaseEntity {

  constructor(
  public id: number,
  public artistId: number,
  public name: string,
  public text: string,
  ) {
    super(id);
  }
}
