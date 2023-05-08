export type Queue = {
	publish(message: string): Promise<void>;
};
