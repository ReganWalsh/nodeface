import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from "@angular/common/http";
import { Injectable } from "@angular/core";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authorisationService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authorisationService.getToken(); //Obtain Token
    const authRequest = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + authToken) //Set Header With Created Token
    });
    return next.handle(authRequest);
  }
}
