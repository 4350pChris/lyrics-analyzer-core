import test from "ava";
import { ArtistAggregate } from "../../../src/domain/entities/ArtistAggregate.js";
import { Song } from '../../../src/domain/entities/Song.js';

const makeArtist = (name: string, description: string) => new ArtistAggregate(name, description);

const makeSong = (name: string, text: string) => new Song(name, text);

const makeArtistWithSongs = (name: string, description: string, songs: Song[]) => {
  const artist = makeArtist(name, description);
  songs.forEach((song) => artist.addSong(song.name, song.text));
  return [artist, songs] as const;
};

test("Create artist", (t) => {
  const artist = makeArtist("name", "description");
  t.is(artist.name, "name");
  t.is(artist.description, "description");
});

test("Add songs to artist", (t) => {
  const [artist, songs] = makeArtistWithSongs("name", "description", [
    makeSong("song1", "text1"),
    makeSong("song2", "text2"),
  ]);
  t.deepEqual(artist.songs, songs);
})

test("Get combined word list", (t) => {
  const [artist, songs] = makeArtistWithSongs("name", "description", [
    makeSong("song1", "text1"),
    makeSong("song2", "text1 text2"),
  ]);
  const wordList = artist.getCombinedWordList();
  t.deepEqual(wordList, { text1: 2, text2: 1 });
});

test("Get stats for artist", (t) => {
  const [artist, songs] = makeArtistWithSongs("name", "description", [
    makeSong("song1", "text1"),
    makeSong("song2", "text2"),
  ]);
  artist.calculateStats();
  t.not(artist.stats, undefined);
  t.is(artist.stats!.uniqueWords, 2);
  t.is(artist.stats!.averageLength, 5);
});
