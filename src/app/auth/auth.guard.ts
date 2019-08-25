import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authorisationService: AuthService, private router: Router) {} //Injected Service And Router

  canActivate(
    route: ActivatedRouteSnapshot, //Snapshot Of The Route Within This Component
    state: RouterStateSnapshot //Tree Of ActivatedRouteSnapshots
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authorisationService.getIsAuth(); //Get If The Users Is Authenticated
    if (!isAuth) {
      this.router.navigate(['/login']); //Navigate To Login If Not Authenticated
    }
    return isAuth;
  }
}
