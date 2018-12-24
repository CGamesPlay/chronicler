// @flow

import { sendRequest } from "./ipcClient";

opaque type Cursor = string;

export type Page = {
  id: number,
  title: string,
  url: string,
  createdAt: string,
  updatedAt: string,
};

export type FullTextResult = {
  pageId: number,
  url: string,
  // Page title, formatted similarly to the snippet
  title: string,
  // Extracted text from the document. Specific matches query terms are encoded
  // in this string:
  // - "<b>" precedes the start of a specific match.
  // - "</b>" follows the end of a specific match.
  // - <b>...</b>" is inserted where content has been removed.
  snippet: string,
};

type PageQuery = {
  first: number,
  after?: ?Cursor,
};

type PageResults = {
  pages: Array<Page>,
  hasMore: boolean,
  cursor: Cursor,
};

export const queryPages = (variables: PageQuery): Promise<PageResults> => {
  return sendRequest({ query: "getPages", variables }).then(pages => {
    return {
      pages,
      hasMore: false,
      cursor: "abc123",
    };
  });
};

type FullTextQuery = {
  query: string,
  first: number,
  after?: ?Cursor,
};

type FullTextResults = {
  results: Array<FullTextResult>,
  hasMore: boolean,
  cursor: Cursor,
};

export const fullTextSearch = (
  variables: FullTextQuery,
): Promise<FullTextResults> => {
  return Promise.resolve({
    results: [
      {
        pageId: 0,
        title: "There's no place like localhost",
        url: "http://vcap.me",
        snippet: "lorem ipsum dolor <b>foo bar baz</b> sit amet",
      },
    ],
    hasMore: false,
    cursor: "abc123",
  });
};
