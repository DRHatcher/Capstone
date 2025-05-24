import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: false
})
export class HomeComponent implements OnInit {

  public userInfo: any;

  constructor(
    public loginService: LoginService,
    public router: Router,
  ) {

  }


  ngOnInit(): void {
    this.loginService.userInfo$.subscribe((res) => {
      this.userInfo = res;
    });

  }

  logout() {
    this.loginService.logout();
  }

  navigate(path: string) {
    this.router.navigate(['home', path]);
  }
  
}
