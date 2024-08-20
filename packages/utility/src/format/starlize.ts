/**
 * Format name in the middle will be replaced with *. (string length > 2)
 *
 * @example
 * starlizeName('张三') // => '张*'
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
 * Format card number or other string in the middle will be replaced with *. (string length > front + after)
 *
 * @example
 * starlizeCard('000', 1, 1) // => '0*0'
 * starlizeCard('0000', 1, 1) // => '0**0'
 * starlizeCard('0000', 2, 1) // => '00*0'
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
