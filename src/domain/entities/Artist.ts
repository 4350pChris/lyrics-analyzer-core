import { BaseEntity } from './BaseEntity.js';

export class Artist extends BaseEntity {
  constructor(
    public name: string,
    public description: string,
    public imageUrl?: string,
  ) {
    super();
  }
}
