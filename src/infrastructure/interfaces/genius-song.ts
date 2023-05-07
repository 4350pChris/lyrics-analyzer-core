export type GeniusSong = {
	id: number;
	title_with_featured: string;
	song_art_image_thumbnail_url: string;
	primary_artist: {
		id: number;
		name: string;
	};
	release_date_components: {
		year: number;
		month: number;
		day: number;
	};
};
