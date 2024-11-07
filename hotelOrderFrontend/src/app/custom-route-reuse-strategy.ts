import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false; // We don't want to store the route
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    // No need to store the route, as we don't want to reuse it
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false; // No need to reattach stored routes
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null; // We don't want to retrieve any stored routes
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return false; // Always force the route to be recreated
  }
}
