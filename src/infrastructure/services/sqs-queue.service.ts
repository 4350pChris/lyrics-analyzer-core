/* eslint-disable @typescript-eslint/naming-convention */
import {type SQSClient, SendMessageCommand} from '@aws-sdk/client-sqs';
import {type QueueService} from '@/application/interfaces/queue.service.interface';
import {type FetchSongsDto} from '@/application/dtos/fetch-songs.dto';
import {type WorkflowTriggerDto} from '@/application/dtos/workflow-trigger.dto';

export class SqsQueueService implements QueueService {
	constructor(
		private readonly sqs: SQSClient,
		private readonly fetchSongsQueueUrl: string,
		private readonly parseLyricsQueueUrl: string,
		private readonly analysisQueueUrl: string,
	) {}

	async sendToFetchQueue(dto: WorkflowTriggerDto): Promise<void> {
		await this.publish(this.fetchSongsQueueUrl, JSON.stringify(dto));
	}

	async sendToParseQueue(dto: FetchSongsDto): Promise<void> {
		await this.publish(this.parseLyricsQueueUrl, JSON.stringify(dto));
	}

	async sendToAnalysisQueue(dto: FetchSongsDto): Promise<void> {
		await this.publish(this.analysisQueueUrl, JSON.stringify(dto));
	}

	private async publish(queueUrl: string, message: string): Promise<void> {
		const cmd = new SendMessageCommand({
			MessageBody: message,
			QueueUrl: queueUrl,
		});
		await this.sqs.send(cmd);
	}
}
