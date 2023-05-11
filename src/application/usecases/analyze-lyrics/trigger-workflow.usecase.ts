import {type WorkflowTriggerDto} from '../../dtos/workflow-trigger.dto';
import {type Queue} from '@/application/interfaces/queue.interface';

export class TriggerWorkflow {
	constructor(
		private readonly queueService: Queue,
	) {}

	async execute(artistId: string): Promise<void> {
		const dto: WorkflowTriggerDto = {artistId};
		await this.queueService.publish(JSON.stringify(dto));
	}
}
