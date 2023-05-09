import {BaseEntity} from './base.entity';

export class Song extends BaseEntity {
	constructor(
		public readonly id: number,
		public readonly name: string,
		public readonly text: string,
		public readonly url: string,
	) {
		super();
	}
}
