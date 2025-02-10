export const sentenceCase = (sentence: string) =>
  sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();

export const formatTokens = (num: number): string => {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}G`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
};
