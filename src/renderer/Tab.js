// @flow

export default class Tab {
  id: string;
  title: string;
  url: string;
  loadFraction: number;
  canNavigateBack: boolean;
  canNavigateForward: boolean;

  constructor(id: string) {
    this.id = id;
    this.title = "Blank Tab";
    this.url = "";
    this.loadFraction = 1;
    this.canNavigateBack = false;
    this.canNavigateForward = false;
  }

  update(data: any) {
    Object.assign(this, data);
  }
}
