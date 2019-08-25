import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./login.component.html", //Template Based On The HTML File In Same Directory
  styleUrls: ["./login.component.css"] //Styling Provided By The CSS
})
export class LoginComponent implements OnInit, OnDestroy {
  isPageLoading = false;
  private authStatusSubscription: Subscription; //Initialise The Subscription Used For Logging In A User

  constructor(public authorisationService: AuthService) {} //Inject The Authorisation Service Into the Class

  ngOnInit() { //Initialisation Code For This Class
    this.authStatusSubscription = this.authorisationService.getAuthStatusListener().subscribe( //
      authStatus => {
        this.isPageLoading = false;
      }
    );
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isPageLoading = true; //Set Loading Of The Page To True (Uses Spinner)
    this.authorisationService.login(form.value.email, form.value.password); //Trys To Login With Provided Details
  }

  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe(); //Cleans Up Controller When Class Is Used
  }
}
