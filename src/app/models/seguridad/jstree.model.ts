export class JsTreeModel {
  id: number;
  text: string;
  state: JsTreeAttribute;
  children: JsTreeModel[] | null;
  a_attr: JsTreeAAtribute;

  constructor(js: JsTreeModel) {
    this.id = js.id;
    this.text = js.text;
    this.state = js.state;
    this.children = js.children;
    this.a_attr = js.a_attr;
  }
}

/*export class JsTreeModelMenu {
  id: number;
  text: string;
  state: JsTreeAttribute;
  children: JsTreeModelMenu[];
  a_attr: JsTreeAAtribute;

  constructor(js: JsTreeModelMenu) {
    this.id = js.id;
    this.text = js.text;
    this.state = js.state;
    this.children = js.children;
    this.a_attr = js.a_attr;
  }
}*/

export class JsTreeAttribute {
  opened: boolean;
  selected: boolean;

  constructor(js: JsTreeAttribute) {
    this.opened = js.opened;
    this.selected = js.selected;
  }
}

export class JsTreeAAtribute {
  href: string;
  style: string | null;

  constructor(js: JsTreeAAtribute) {
    this.href = js.href;
    this.style = js.style;
  }
}
