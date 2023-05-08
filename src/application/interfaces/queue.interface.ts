export type Queue = {
	publish(message: any): Promise<void>;
};
