export type ProcessTableRepository = {
	save(processId: string, total: number): Promise<void>;
	update(processId: string, current: number): Promise<void>;
	get(processId: string): Promise<number | undefined>;
};
