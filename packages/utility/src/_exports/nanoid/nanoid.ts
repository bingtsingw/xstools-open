import { customAlphabet } from 'nanoid';
import { DIC_ALPHANUMERIC } from '../../string';

export const nanoid = customAlphabet(DIC_ALPHANUMERIC, 21);
