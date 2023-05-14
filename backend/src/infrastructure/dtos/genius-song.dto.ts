export type GeniusSongDto = {
	id: number;
	title_with_featured: string;
	url: string;
	primary_artist: {
		id: number;
		name: string;
		image_url?: string;
	};
};
