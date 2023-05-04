import test from "ava";
import { Stats } from "../../../src/domain/entities/Stats.js";

const makeStats = (wordList: Record<string, number>) => new Stats(1, 1, wordList);

test("Calculate unique words", (t) => {
  const stats = makeStats({ a: 1, b: 2, c: 3 });
  stats.calculateUniqueWords()
  t.is(stats.uniqueWords, 3);
})
