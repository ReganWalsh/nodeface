import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit, OnDestroy {
  isPageLoading = false;
  private authStatusSubscription: Subscription;

  constructor(public authorisationService: AuthService) {} //Injected Service

  ngOnInit() { //Initialisation Code
    this.authStatusSubscription = this.authorisationService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isPageLoading = false;
      }
    );
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isPageLoading = true;
    this.authorisationService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy() { //Clean Up Code
    this.authStatusSubscription.unsubscribe();
  }
}
