export class SidenavItem {
  name: string = "";
  icon?: string;
  routeOrFunction?: any;
  parent?: SidenavItem;
  subItems?: SidenavItem[];
  position?: number;
  pathMatchExact?: boolean;
  badge?: string;
  badgeColor?: string;
  type?: 'item' | 'subheading';
  customClass?: string;

  constructor(item: SidenavItem) {
    this.name = item.name;
    this.icon = item.icon;
    this.routeOrFunction = item.routeOrFunction;
    this.parent = item.parent;
    this.subItems = item.subItems;
    this.position = item.position;
    this.pathMatchExact = item.pathMatchExact;
    this.badge = item.badge;
    this.badgeColor = item.badgeColor;
    this.type = item.type;
    this.customClass = item.customClass;
  }
}
