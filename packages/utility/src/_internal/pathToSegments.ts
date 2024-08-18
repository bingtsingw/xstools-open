/**
 * Converts a deep key string into an array of path segments.
 *
 * References: https://github.com/toss/es-toolkit/blob/main/src/compat/_internal/toPath.ts
 *
 * @example
 * toSegments('') // => []
 * toSegments('a.b.c') // => ['a', 'b', 'c']
 * toSegments('a[b][c]') // => ['a', 'b', 'c']
 * toSegments('.a.b.c') // => ['', 'a', 'b', 'c']
 * toSegments('a["b.c"].d') // => ['a', 'b.c', 'd']
 * toSegments('.a[b].c.d[e]["f.g"].h') // => ['', 'a', 'b', 'c', 'd', 'e', 'f.g', 'h']
 */
export function pathToSegments(deepKey: string): string[] {
  const ESCAPE_REGEXP = /\\(\\)?/g;
  const PROPERTY_REGEXP = RegExp(
    // Match anything that isn't a dot or bracket.
    '[^.[\\]]+' +
      '|' +
      // Or match property names within brackets.
      '\\[(?:' +
      // Match a non-string expression.
      '([^"\'][^[]*)' +
      '|' +
      // Or match strings (supports escaping characters).
      '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
      ')\\]' +
      '|' +
      // Or match "" as the space between consecutive dots or empty brackets.
      '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))',
    'g',
  );

  const result: string[] = [];

  if (deepKey[0] === '.') {
    result.push('');
  }

  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = PROPERTY_REGEXP.exec(deepKey)) !== null) {
    let key = match[0];
    const expr = match[1];
    const quote = match[2];
    const substr = match[3];

    if (quote && substr) {
      key = substr.replace(ESCAPE_REGEXP, '$1');
    } else if (expr) {
      key = expr;
    }

    result.push(key);

    if (PROPERTY_REGEXP.lastIndex === lastIndex) {
      PROPERTY_REGEXP.lastIndex++;
    } else {
      lastIndex = PROPERTY_REGEXP.lastIndex;
    }
  }

  return result;
}
