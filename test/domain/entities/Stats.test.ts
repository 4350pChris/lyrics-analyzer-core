import test from "ava";
import { Stats } from "../../../src/domain/entities/Stats.js";

const makeStats = (wordList: Record<string, number>) => new Stats( 1, wordList);

test("Calculate unique words", (t) => {
  const stats = makeStats({ a: 1, b: 2, c: 3 });
  const uniques = stats.calculateUniqueWords()
  t.is(uniques, 3);
})

test("Get top X words", (t) => {
  const stats = makeStats({ a: 1, b: 2, c: 3, d: 1 });
  const topX = stats.getTopXWords(2)
  t.deepEqual(topX, [['c', 3], ['b', 2]]);
});

test("Get average length of words", (t) => {
  const stats = makeStats({ a: 1, b: 2, c: 3 });
  const averageLength = stats.calculateAverageLengthOfWords();
  t.is(averageLength, 1);
});

test("Get average length of words, make sure weights are taken into account", (t) => {
  // (1 * 1 + 2 * 2 + 3 * 3) / (1 + 2 + 3) = 14 / 6
  const stats = makeStats({ a: 1, aa: 2, aaa: 3 });
  const averageLength = stats.calculateAverageLengthOfWords();
  t.is(averageLength, 14 / 6);
});

test("Get median length of words for uneven wordlist", (t) => {
  const stats = makeStats({ a: 1, bb: 2, ccc: 3 });
  const medianLength = stats.calculateMedianLengthOfWords();
  t.is(medianLength, 2);
});

test("Get median length of words for even wordlist", (t) => {
  const stats = makeStats({ a: 1, bb: 2, ccc: 3, dddd: 4 });
  const medianLength = stats.calculateMedianLengthOfWords();
  t.is(medianLength, 2.5);
});
