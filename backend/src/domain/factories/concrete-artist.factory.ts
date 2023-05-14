import {ArtistAggregate} from '../entities/artist.aggregate';
import {type ArtistProps} from '../interfaces/artist-props.interface';
import {type ArtistFactory} from '../interfaces/artist.factory.interface';
import {type StatisticsCalculator} from '../interfaces/statistics-calculator.interface';

export class ConcreteArtistFactory implements ArtistFactory {
	constructor(
		private readonly statisticsCalculator: StatisticsCalculator,
	) {}

	createArtist(props: ArtistProps): ArtistAggregate {
		const artist = new ArtistAggregate(props);
		artist.setStatisticsCalculator(this.statisticsCalculator);
		return artist;
	}
}
