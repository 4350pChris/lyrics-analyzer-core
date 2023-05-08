export type GeniusSong = {
	id: number;
	title_with_featured: string;
	url: string;
	song_art_image_thumbnail_url?: string;
	primary_artist: {
		id: number;
		name: string;
		image_url?: string;
	};
	release_date_components: {
		year: number;
		month: number;
		day: number;
	};
};
