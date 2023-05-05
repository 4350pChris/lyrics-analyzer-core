import { BaseEntity } from './BaseEntity.js';

export class Song extends BaseEntity {

  constructor(
  public artistId: number,
  public name: string,
  public text: string,
  ) {
    super();
  }
}
