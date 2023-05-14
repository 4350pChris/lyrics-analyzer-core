export type UseCase = {
	execute(...args: any[]): Promise<any>;
};
