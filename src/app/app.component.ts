import { Component } from '@angular/core';
import { APIService } from './api-service.service';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './login.service';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: false
})
export class AppComponent {
  title = 'scheduling-project';
  loggedIn = false;
  loginChecked = false;
  confirm = false;
  public emails: any;
  constructor (
    public APIService:APIService,
    public cookieService: CookieService,
    public loginService: LoginService,
    public router: Router
  ) {

  }

  ngOnInit(): void {
    const route = this.router.url;
    this.confirm = (window.location.search === '?confirm=true');
    this.checkLogin();
    

    this.loginService.loggedIn$.subscribe((res) => {
      this.loggedIn = res;
    });
  }

  logout() {
    this.loginService.logout();
  }

  checkLogin() {
    this.loginService.checkLogin();
  }

      // this.cookieService.delete('loggedIn');
}
