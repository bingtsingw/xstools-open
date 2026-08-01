/**
 * Mask a personal name with `*`.
 *
 * Length 2 keeps the last character (`张三` → `*三`). Longer names keep the
 * first and last characters and mask the middle.
 *
 * @example
 * starlizeName('张三') // => '*三'
 * starlizeName('张三李') // => '张*李'
 * starlizeName('张三李四') // => '张**四'
 */
export const starlizeName = (name: string): string => {
  const length = name.length;

  if (length <= 1) {
    return name;
  }

  if (length === 2) {
    return `*${name[length - 1]}`;
  }

  return `${name[0]}${'*'.repeat(length - 2)}${name[length - 1]}`;
};

/**
 * Mask the middle of a card number with `*`.
 *
 * @param card - The card number.
 * @param front - Characters to keep at the beginning.
 * @param after - Characters to keep at the end.
 *
 * @example
 * starlizeCard('000', 1, 1) // => '0*0'
 * starlizeCard('0000', 1, 1) // => '0**0'
 * starlizeCard('0000', 2, 1) // => '00*0'
 * starlizeCard('0000000000000000', 0, 0) // => '****************'
 * starlizeCard('0000000000000000', 4, 4) // => '0000********0000'
 */
export const starlizeCard = (card: string, front: number, after: number): string => {
  const length = card.length;

  if (length <= front + after) {
    if (length <= after) {
      return '*'.repeat(length);
    }

    return '*'.repeat(length - after) + card.substring(length - after);
  }

  return card.substring(0, front) + '*'.repeat(length - front - after) + card.substring(length - after);
};
