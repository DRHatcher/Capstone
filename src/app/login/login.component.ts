import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from '../api-service.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    standalone: false
})
export class LoginComponent {


  public loginForm: any;
  public registerForm: any;
  public registering = false;
  public loading = false;
  public studentMessage = 'Thank you for submitting your registration request. You will receive an email shortly with a validation link to complete your registration.';
  public adminRootMessage = 'Thank you for submitting your registration request. You will receive an email when your requests has been approved or denied.';
  public showNotice = false;
  public showPasswordConflict = false;

  constructor(
    public cookieService: CookieService,
    public loginService: LoginService,
    public apiService: APIService,
    public fb: FormBuilder,
    public router: Router,
    public snackBar: MatSnackBar
  ) {

  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      'email': ['', [Validators.required]],
      'password': ['', [Validators.required]],
    });
    this.registerForm = this.fb.group({
      'email': ['', [Validators.required]],
      'password': ['', [Validators.required]],
      'passwordConfirm': ['', [Validators.required]],
      'role': ['', [Validators.required]],
    });
  }

  logIn() {
    this.loginForm.disable();
    this.loading = true;
    const loginData = {
      requestersEmail: this.loginForm.value.email,
      requestersPassword: this.loginForm.value.password,
    };
    this.apiService.login(loginData.requestersEmail, loginData.requestersPassword).subscribe((res) => {
      this.loginService.setLoginCookie(res);
      this.loading = false;
      this.loginForm.enable();
      this.router.navigate(['/']);
    }, (err) => {
      this.loading = false;
      this.loginForm.enable();
      this.snackBar.open('Username or password is incorrect.', 'Close');
    })
  }

  passwordConflict() {
    return this.registerForm.controls.password.value !== this.registerForm.controls.passwordConfirm.value;
  }

  register() {
    if (!this.passwordConflict()) {
      this.showPasswordConflict = false;
      this.registerForm.disable();
      this.loading = true;
      const regData = {
        requestersEmail: this.registerForm.value.email,
        requestersPassword: this.registerForm.value.password,
        role: this.registerForm.value.role
      };
      this.apiService.register(regData).subscribe((res) => {
        this.showNotice = true;
        this.loading = false;
        this.registerForm.enable();
      }, (err) => {
        this.loading = false;
        this.registerForm.enable();
        this.snackBar.open('This email already exist in our database. You may already be a registered user or you have submitted a registration request before.', 'Close');
      })
    } else {
      this.showPasswordConflict = true;
    }
  }

  toggleRegister() {
    this.registering = !this.registering;
  }

  goBack() {
    location.reload();
  }

}
