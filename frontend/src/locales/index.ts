import fromPairs from "lodash/fromPairs";

import en from "./en/embed";
import zh from "./zh/embed";

const localePairs = [
  ["en", en],
  ["zh", zh],
];

export const languages = localePairs.map((locale) => locale[0]);

export const embedLocales = fromPairs(localePairs);
