// @flow

export default class Tab {
  id: string;
  title: string;

  constructor(id: string) {
    this.id = id;
    this.title = "New Tab";
  }

  setWebview(w: Webview) {
    console.log("webview", w);
  }
}
