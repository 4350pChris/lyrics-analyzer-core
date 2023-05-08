import type {GeniusApi} from '../interfaces/genius-api.interface.js';
import type {RichSongDto} from '@/application/dtos/rich-song.dto.js';
import type {SearchArtistsDto} from '@/application/dtos/search-artist.dto.js';
import type {LyricsApiService} from '@/application/interfaces/lyrics-api.interface.js';

export class GeniusService implements LyricsApiService {
	constructor(
		private readonly geniusApiClient: GeniusApi,
	) {}

	async searchArtists(query: string): Promise<SearchArtistsDto[]> {
		const {response} = await this.geniusApiClient.search(query);
		const allArtists = response.hits.map(
			({result}) => {
				const artist: SearchArtistsDto = {
					id: result.primary_artist.id,
					name: result.primary_artist.name,
					imageUrl: result.primary_artist.image_url,
				};
				return [result.primary_artist.id, artist] as const;
			});

		// This removes duplicates
		const artists: Record<number, SearchArtistsDto> = Object.fromEntries(allArtists);
		return Object.values(artists);
	}

	async retrievePaginatedSongs(artistId: number, page: number): Promise<RichSongDto[]> {
		const {response} = await this.geniusApiClient.getSongsForArtist(artistId, page);
		const enriched = response.songs.map(song => ({
			id: song.id,
			title: song.title_with_featured,
			imageUrl: song.song_art_image_thumbnail_url,
			artist: {
				id: song.primary_artist.id,
				name: song.primary_artist.name,
				imageUrl: song.primary_artist.image_url,
			},
			releaseDate: new Date(song.release_date_components.year, song.release_date_components.month, song.release_date_components.day),
		})) satisfies RichSongDto[];
		return enriched;
	}
}
