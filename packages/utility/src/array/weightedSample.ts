import { ParamError } from '../error';

/**
 * Returns a random element from an array according to its weight.
 *
 * A weight of zero excludes an element. Empty arrays or a total weight of zero
 * yield `undefined`.
 *
 * @param arr - The array to sample from.
 * @param getWeight - Returns a non-negative finite weight for each item.
 * @returns A randomly selected element, or `undefined` when nothing can be picked.
 * @throws {ParamError} When a weight is negative, `NaN`, or non-finite, or the total overflows.
 *
 * @example
 * weightedSample(
 *   [{ value: 'common', weight: 9 }, { value: 'rare', weight: 1 }],
 *   item => item.weight,
 * ) // => 'common' has a 90% chance of being selected
 */
export const weightedSample = <T>(
  arr: readonly T[],
  getWeight: (item: T, index: number, arr: readonly T[]) => number,
): T | undefined => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return undefined;
  }

  const weights = arr.map(getWeight);
  let totalWeight = 0;

  for (const weight of weights) {
    if (!Number.isFinite(weight) || weight < 0) {
      throw new ParamError('Weights must be finite, non-negative numbers');
    }

    totalWeight += weight;

    if (!Number.isFinite(totalWeight)) {
      throw new ParamError('Total weight must be finite');
    }
  }

  if (totalWeight === 0) {
    return undefined;
  }

  const target = Math.random() * totalWeight;
  let accumulatedWeight = 0;

  for (const [index, weight] of weights.entries()) {
    accumulatedWeight += weight;

    if (target < accumulatedWeight) {
      return arr[index];
    }
  }

  return undefined;
};
