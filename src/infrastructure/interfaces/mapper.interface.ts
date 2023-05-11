import type {AnyItem} from 'dynamoose/dist/Item';

export type Mapper<T, M = Partial<AnyItem>> = {
	toDomain(item: M): T;
	toModel(item: T): M;
};
