export type IntegrationEvent<T extends string> = {
	artistId: number;
	eventType: T;
};
