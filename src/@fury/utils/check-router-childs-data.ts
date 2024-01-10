import { ActivatedRouteSnapshot } from '@angular/router';

export function checkRouterChildsData(route: ActivatedRouteSnapshot, compareWith: (data: any) => boolean): any {
  if (compareWith(route.data)) {
    return true;
  }

  if (!route.firstChild) {
    return false;
  }

  return checkRouterChildsData(route.firstChild, compareWith);
}
