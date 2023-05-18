import {type IntegrationEvent} from '../events/integration.event';

export type IntegrationEventBus = {
	publishIntegrationEvent<T extends IntegrationEvent<string>>(event: T): Promise<void>;
};
