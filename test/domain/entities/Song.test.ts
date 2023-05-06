import test from "ava";
import { Song } from "../../../src/domain/entities/Song.js";

const makeSong = (name: string, text: string) => new Song(name, text);

test("Create song", (t) => {
  const song = makeSong("name", "text");
  t.is(song.name, "name");
  t.is(song.text, "text");
});

test("Get word list", (t) => {
  const song = makeSong("name", "some text goes here");
  const wordList = song.getWordList();
  t.deepEqual(wordList, { text: 1, goes: 1, here: 1, some: 1 });
});
