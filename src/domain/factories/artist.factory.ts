import {ArtistAggregate} from '../entities/artist.aggregate';
import {type ArtistProps} from '../interfaces/artist-props.interface';
import {type ArtistFactory} from '../interfaces/concrete-artist.factory.interface';
import {type StatisticsCalculator} from '../interfaces/statistics-calculator.interface';

export class ConcreteArtistFactory implements ArtistFactory {
	constructor(
		private readonly statisticsCalculator: StatisticsCalculator,
	) {}

	createArtist(props: ArtistProps): ArtistAggregate {
		const artist = new ArtistAggregate(props);
		artist.statisticsCalculator = this.statisticsCalculator;
		return artist;
	}
}
