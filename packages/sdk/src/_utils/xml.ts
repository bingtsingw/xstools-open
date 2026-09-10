import { XMLParser } from 'fast-xml-parser';
import { utilsError } from './utilsError';

export const parseXML = <T extends Record<string, unknown>>(xml: string): T => {
  try {
    const parser = new XMLParser();
    return parser.parse(xml);
  } catch (cause) {
    throw utilsError('parseXML', cause);
  }
};
