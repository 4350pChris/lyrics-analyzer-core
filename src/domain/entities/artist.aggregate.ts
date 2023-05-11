type ArtistAggregateProps = {
	id: number;
	name: string;
	description: string;
	songs?: number[];
	imageUrl?: string;
	stats?: number[];
};

export class ArtistAggregate {
	public readonly id: number;
	public readonly name: string;
	public readonly description: string;
	public readonly songs: number[];
	public readonly imageUrl?: string;
	public readonly stats: number[];

	constructor({
		id,
		name,
		description,
		songs,
		imageUrl,
		stats,
	}: ArtistAggregateProps) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.songs = songs ?? [];
		this.imageUrl = imageUrl;
		this.stats = stats ?? [];
	}

	addSong(songId: number): void {
		this.songs.push(songId);
	}

	addStats(statsId: number): void {
		this.stats.push(statsId);
	}
}
