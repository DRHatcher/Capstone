import { Injectable } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public loggedIn = false;
  public userInfo: any;
  public userEmail: string = '';
  public userRole: string = '';

  private _loggedIn$ = new BehaviorSubject<any>(this.loggedIn);
  public loggedIn$ = this._loggedIn$.asObservable();

  private _userInfo$ = new BehaviorSubject<any>('');
  public userInfo$ = this._userInfo$.asObservable();

  constructor(
    public cookieService: CookieService,
    public router: Router
  ) { }

  checkLogin() {
    const cookie = this.cookieService.get('loggedIn');
    if (cookie) {
      const loginInfo = JSON.parse(cookie);
      console.log('Parsed login info:', loginInfo); // Log parsed info
      this._userInfo$.next(JSON.parse(cookie));
      this.userEmail = loginInfo.userEmail;
      this.userRole = loginInfo.role;
      this.loggedIn = true;
      this._loggedIn$.next(true);

      console.log('User email set to:', this.userEmail); // Debugging
      console.log('User role set to:', this.userRole);   // Debugging
    } else {
      this.loggedIn = false;
      this._loggedIn$.next(false);
    }
  }

  setLoginCookie(loginInfo: any) {
    // loginInfo = { role: 'ROOT', email: ''};
    this.cookieService.set('loggedIn', JSON.stringify(loginInfo));
    this.checkLogin();
    this.userEmail = loginInfo.userEmail;
    this.userRole = loginInfo.role;
  }


  logout() {
    this.cookieService.delete('loggedIn');
    // this.checkLogin();
    this.userEmail = '';
    location.reload();
  }

}
