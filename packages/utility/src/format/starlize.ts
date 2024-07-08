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
