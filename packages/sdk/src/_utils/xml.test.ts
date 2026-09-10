import { describe, expect, spyOn, test } from 'bun:test';
import { XMLParser } from 'fast-xml-parser';
import { parseXML } from './xml';
import { SdkExceptionInternalError } from '../_errors';

describe('xml', () => {
  test('retains parser failure cause and utility source', () => {
    const cause = new Error('parser failure');
    const parse = spyOn(XMLParser.prototype, 'parse').mockImplementation(() => {
      throw cause;
    });
    try {
      try {
        parseXML('<xml/>');
        throw new Error('Expected parse failure');
      } catch (error) {
        expect(error).toMatchObject({
          _tag: '__XSTOOLS_SDK__EXCEPTION_INTERNAL_ERROR',
          cause,
          log: '[XSTOOLS_SDK:UTILS(parseXML)]: parser failure',
        });
      }
    } finally {
      parse.mockRestore();
    }
    expect(parseXML('<xml><value>ok</value></xml>')).toEqual({ xml: { value: 'ok' } });
  });

  test('preserves repeated elements, CDATA and decoded entities', () => {
    expect(parseXML('<xml><item>A&amp;B</item><item><![CDATA[<raw>]]></item></xml>')).toEqual({
      xml: { item: ['A&B', '<raw>'] },
    });
  });

  test('tags parser exceptions without making tolerant XML parsing strict', () => {
    expect(() => parseXML(undefined as never)).toThrow(SdkExceptionInternalError);
  });

  test('parseXML', () => {
    // 正常解析
    expect(parseXML('<person><name>John Doe</name><age>30</age></person>')).toEqual({
      person: { name: 'John Doe', age: 30 },
    });
    expect(parseXML('<12>asd</12>@#!')).toEqual({ 12: 'asd' });
    expect(parseXML('$ddg<asd>111</asd>@#!')).toEqual({ asd: 111 });

    // 无法解析
    expect(parseXML(' ')).toEqual({});
    expect(parseXML(' @#!')).toEqual({});
    expect(parseXML('12 @#!')).toEqual({});
    expect(parseXML('wrong')).toEqual({});

    // 反直觉
    expect(parseXML('$ddg<pre>111</asd>@#!')).toEqual({ pre: 111 });
  });
});
