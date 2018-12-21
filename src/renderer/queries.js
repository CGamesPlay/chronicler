// @flow

import { sendRequest } from "./ipcClient";

opaque type Cursor = string;

type Page = {
  id: number,
  title: string,
  url: string,
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
