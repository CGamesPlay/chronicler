// @flow
import { URL } from "url";

export const parseUrl = (input: string) => {
  let url = input;
  if (!/\w+:\/\//.test(url)) {
    url = `http://${url}`;
  }
  url = new URL(url);
  return url.href;
};
