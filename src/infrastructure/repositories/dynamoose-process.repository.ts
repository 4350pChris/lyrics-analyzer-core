import {type ModelType} from 'dynamoose/dist/General';
import {type ProcessModelItem} from '../models/process.model';
import {type ProcessTableRepository} from '@/application/interfaces/process-tracker-repository.interface';

export class DynamooseProcessRepository implements ProcessTableRepository {
	constructor(
		private readonly processModel: ModelType<ProcessModelItem>,
	) {}

	async save(processId: string, total: number): Promise<void> {
		await this.processModel.create({id: processId, total});
	}

	async update(processId: string, current: number): Promise<void> {
		await this.processModel.update({id: processId}, {total: current});
	}

	async get(processId: string): Promise<number | undefined> {
		const item = await this.processModel.get(processId);
		return item?.total;
	}
}
