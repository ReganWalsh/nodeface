import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { AuthData } from "./auth-data.model";
const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false; //Initialisation Values
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authorisationStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {} //Injected Classes

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authorisationStatusListener.asObservable();
  }

  createUser(email: string, password: string) { //Create A User Based On An E-Mail And Password
    const authData: AuthData = { email: email, password: password };
    this.http.post(BACKEND_URL + "/signup", authData).subscribe( //Post Method Called On Service URL
      () => {
        this.router.navigate(["/"]); //Then Navigate To Home Page
      },
      error => {
        this.authorisationStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) { //Login Based On E-Mail And Password
    const authData: AuthData = { email: email, password: password }; //Object With Provided Details
    this.http.post<{ token: string; expiresIn: number; userId: string }>( //Send Post Request With Token, How Long Token Lasts And UserID
        BACKEND_URL + "/login", //Login Service
        authData
      ).subscribe(
        response => {
          const token = response.token; //Returned Token
          this.token = token;
          if (token) { //If Token Exists
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration); //Set Time Of Token
            this.isAuthenticated = true;
            this.userId = response.userId; //Return User ID
            this.authorisationStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000 //Creates Token For 1 Hour
            );
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.userId); //Save The Authentication Data
            this.router.navigate(["/"]); //Navigate To Home Page
          }
        },
        error => {
          this.authorisationStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime(); //Get Remaining Time On Token
    if (expiresIn > 0) { //If Still Valid Then Process
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authorisationStatusListener.next(true);
    }
  }

  logout() { //Authentication Performed On Logout
    this.token = null;
    this.isAuthenticated = false;
    this.authorisationStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]); //Navigate Home
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration); //Display Timer On Token
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) { //Save Data Needed To Authorise User
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() { //Remove Authenitication Data
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() { //Returns Data Associated With Token
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return { //Return JavaScript Object With Authentication Data
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
}
