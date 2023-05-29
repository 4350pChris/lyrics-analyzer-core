import {type TriggerWorkflowEvent} from '@/application/events/trigger-workflow.event';

export default {
	type: 'object',
	properties: {
		artistId: {
			type: 'number',
		},
		eventType: {
			const: 'triggerWorkflow' satisfies TriggerWorkflowEvent['eventType'],
		},
	},
	required: ['artistId'],
} as const;
