import {type getProcessModel} from '../models/process.model';
import {type ProcessTableRepository} from '@/application/interfaces/process-tracker-repository.interface';

export class DynamooseProcessRepository implements ProcessTableRepository {
	constructor(
		private readonly processModel: ReturnType<typeof getProcessModel>,
	) {}

	async save(processId: string, total: number): Promise<void> {
		await this.processModel.create({processId, total});
	}

	async update(processId: string, current: number): Promise<void> {
		await this.processModel.update({processId}, {total: current});
	}

	async get(processId: string): Promise<number> {
		const result = await this.processModel.get(processId);
		return result.total as number;
	}
}
