// @flow

export default class Tab {
  id: string;
  title: string;
  url: string;

  constructor(id: string) {
    this.id = id;
    this.title = "Blank Tab";
  }

  update(data: any) {
    Object.assign(this, data);
  }
}
