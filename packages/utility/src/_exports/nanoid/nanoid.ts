import { customAlphabet } from 'nanoid';
import { DIC_ALPHANUMERIC } from '../../string';

/**
 * Preconfigured nanoid: alphanumeric alphabet (`DIC_ALPHANUMERIC`), default length 21.
 * Optional size argument follows upstream `nanoid(size?)`.
 */
export const nanoid = customAlphabet(DIC_ALPHANUMERIC, 21);
