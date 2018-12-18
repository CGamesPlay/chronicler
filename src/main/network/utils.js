// @flow
import { Readable, PassThrough } from "stream";

export const teeStream = (readable: Readable) => {
  const one = new PassThrough();
  const two = new PassThrough();
  readable.pipe(one);
  readable.pipe(two);
  return [one, two];
};
