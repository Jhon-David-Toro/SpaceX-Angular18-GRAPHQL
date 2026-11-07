import { clamp, compact, groupBy, normalizeText, secureUrl, sum } from './collections';
import { youtubeId } from './youtube';

describe('collections', () => {
  it('compact removes null and undefined but keeps falsy values', () => {
    expect(compact([0, null, '', undefined, false])).toEqual([0, '', false]);
    expect(compact(null)).toEqual([]);
  });

  it('normalizeText strips accents and case', () => {
    expect(normalizeText('  Misión Ñandú ')).toBe('mision nandu');
  });

  it('secureUrl upgrades http and keeps empty values empty', () => {
    expect(secureUrl('http://farm5.staticflickr.com/a.jpg')).toBe(
      'https://farm5.staticflickr.com/a.jpg',
    );
    expect(secureUrl('')).toBeNull();
    expect(secureUrl(null)).toBeNull();
  });

  it('sum, clamp and groupBy', () => {
    expect(sum([1, 2, 3])).toBe(6);
    expect(clamp(12, 0, 10)).toBe(10);
    expect([...groupBy([1, 2, 3, 4], (n) => n % 2)]).toEqual([
      [1, [1, 3]],
      [0, [2, 4]],
    ]);
  });
});

describe('youtubeId', () => {
  it.each([
    ['https://youtu.be/1MkcWK2PnsU', '1MkcWK2PnsU'],
    ['https://www.youtube.com/watch?v=wbSwFU6tY1c', 'wbSwFU6tY1c'],
    ['https://www.youtube.com/embed/wbSwFU6tY1c', 'wbSwFU6tY1c'],
  ])('extracts the id from %s', (url, id) => {
    expect(youtubeId(url)).toBe(id);
  });

  it.each([
    null,
    '',
    'not a url',
    'https://vimeo.com/123',
    'https://youtu.be/short',
    'https://youtu.be/"><script>',
  ])('rejects %s', (url) => {
    expect(youtubeId(url)).toBeNull();
  });
});
