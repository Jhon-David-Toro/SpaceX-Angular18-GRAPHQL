/** Removes `null`/`undefined` holes, which GraphQL lists are allowed to contain. */
export function compact<T>(list: readonly (T | null | undefined)[] | null | undefined): T[] {
  return (list ?? []).filter((item): item is T => item !== null && item !== undefined);
}

/** Accent- and case-insensitive text normalisation for search. */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

/** Forces https so mixed content never breaks images served by Flickr/Imgur. */
export function secureUrl(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }
  return url.replace(/^http:\/\//i, 'https://');
}

export function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Groups items by key preserving insertion order. */
export function groupBy<T, K>(items: readonly T[], key: (item: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>();
  for (const item of items) {
    const k = key(item);
    const bucket = groups.get(k);
    if (bucket) {
      bucket.push(item);
    } else {
      groups.set(k, [item]);
    }
  }
  return groups;
}
