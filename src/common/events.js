// @flow

export const CHROME_MESSAGE = "CHROME_MESSAGE";

export type ChromeMessageData = {
  type: string,
  payload?: any,
};

export const CHROME_READY = "CHROME_READY";
export const CHROME_RESIZE = "CHROME_RESIZE";
export const TAB_UPDATE = "TAB_UPDATE";
export const TAB_FOCUS = "TAB_FOCUS";
