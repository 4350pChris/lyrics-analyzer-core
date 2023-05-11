export class Stats {
	constructor(
		public readonly uniqueWords: number,
		public readonly averageLength: number,
		public readonly medianLength: number,
		public readonly wordList: Record<string, number>,
	) {}
}
