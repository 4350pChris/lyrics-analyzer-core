import test from "ava";
import { Artist } from "../../../src/domain/entities/Artist.js";
import { Song } from '../../../src/domain/entities/Song.js';

const makeArtist = (name: string, description: string) => new Artist(name, description);
const makeSong = (name: string, text: string) => new Song(1, name, text);

test("Create artist", (t) => {
  const artist = makeArtist("name", "description");
  t.is(artist.name, "name");
  t.is(artist.description, "description");
});

test("Add songs to artist", (t) => {
  const artist = makeArtist("name", "description");
  const song1 = makeSong("song1", "text1");
  const song2 = makeSong("song2", "text2");
  artist.addSong(song1);
  artist.addSong(song2);
  t.deepEqual(artist.songs, [song1, song2]);
})

test("Get combined word list", (t) => {
  const artist = makeArtist("name", "description");
  const song1 = makeSong("song1", "text1");
  const song2 = makeSong("song2", "text1 text2");
  artist.addSong(song1);
  artist.addSong(song2);
  const wordList = artist.getCombinedWordList();
  t.deepEqual(wordList, { text1: 2, text2: 1 });
});
