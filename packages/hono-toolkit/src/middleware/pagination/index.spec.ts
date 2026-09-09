import { describe, expect, test } from 'bun:test';
import { pagination, type CursorPagination, type PagePagination, type PaginationKind } from '../../index';
import * as toolkit from '../../index';

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Expect<T extends true> = T;
type IsFunction<T> = T extends (...args: never) => unknown ? true : false;

describe('pagination namespace', () => {
  test('exposes page and cursor factories and is not callable', () => {
    type NotCallable = Expect<Equal<IsFunction<typeof pagination>, false>>;
    type HasPageKind = Expect<Equal<Extract<PaginationKind, 'page'>, 'page'>>;
    type HasCursorKind = Expect<Equal<Extract<PaginationKind, 'cursor'>, 'cursor'>>;
    type PageVariables = PagePagination['Variables']['page'];
    type CursorVariables = CursorPagination['Variables']['cursor'];
    const typeCheck: NotCallable = true;
    const pageKindCheck: HasPageKind = true;
    const cursorKindCheck: HasCursorKind = true;
    const pageVariablesCheck: Expect<Equal<PageVariables['where'], { offset: number; limit: number }>> = true;
    const cursorVariablesCheck: Expect<Equal<CursorVariables['where'], { cursor?: string; limit: number }>> = true;

    expect(typeCheck).toBe(true);
    expect(pageKindCheck).toBe(true);
    expect(cursorKindCheck).toBe(true);
    expect(pageVariablesCheck).toBe(true);
    expect(cursorVariablesCheck).toBe(true);
    expect(typeof pagination).toBe('object');
    expect(typeof pagination.page).toBe('function');
    expect(typeof pagination.cursor).toBe('function');
    expect('pagination' in toolkit).toBe(true);
    expect('pagePagination' in toolkit).toBe(false);
    expect('cursorPagination' in toolkit).toBe(false);
  });
});
