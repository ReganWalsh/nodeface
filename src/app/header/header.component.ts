import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false; //Default
  private authorisationListenerSubscription: Subscription;
  constructor(private authorisationService: AuthService) {} //Inject Authorisation Service

  ngOnInit() { //Set Up Code
    this.userIsAuthenticated = this.authorisationService.getIsAuth(); //Is The User Authenticated?
    this.authorisationListenerSubscription = this.authorisationService.getAuthStatusListener().subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated //Set Authentication Status When Page Is Loaded Through Use Of Token
      });
  }

  onLogout() {
    this.authorisationService.logout();
  }

  ngOnDestroy() { //Clean Up Subscribers
    this.authorisationListenerSubscription.unsubscribe();
  }
}
