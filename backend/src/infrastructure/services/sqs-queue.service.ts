/* eslint-disable @typescript-eslint/naming-convention */
import {type SQSClient, SendMessageCommand} from '@aws-sdk/client-sqs';
import {type QueueService} from '@/application/interfaces/queue.service.interface';
import {type FetchSongsDto} from '@/application/dtos/fetch-songs.dto';
import {type WorkflowTriggerDto} from '@/application/dtos/workflow-trigger.dto';
import {type Queues} from '@/application/dependency-injection';

export class SqsQueueService implements QueueService {
	constructor(
		private readonly sqs: SQSClient,
		private readonly queueUrls: Record<Queues, string>,
	) {}

	async sendToFetchQueue(dto: WorkflowTriggerDto): Promise<void> {
		await this.publish(this.queueUrls.fetchSongsQueueUrl, JSON.stringify(dto));
	}

	async sendToParseQueue(dto: FetchSongsDto): Promise<void> {
		await this.publish(this.queueUrls.parseLyricsQueueUrl, JSON.stringify(dto));
	}

	async sendToAnalysisQueue(dto: FetchSongsDto): Promise<void> {
		await this.publish(this.queueUrls.analysisQueueUrl, JSON.stringify(dto));
	}

	private async publish(queueUrl: string, message: string): Promise<void> {
		const cmd = new SendMessageCommand({
			MessageBody: message,
			QueueUrl: queueUrl,
		});
		await this.sqs.send(cmd);
	}
}
