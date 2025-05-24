import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CookieService } from 'ngx-cookie-service';
import { LoginComponent } from './login.component';
import { AppRoutingModule } from '../app-routing.module';
import { HomeModule } from '../home/home.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressBarModule} from '@angular/material/progress-bar';




@NgModule({ declarations: [
        LoginComponent,
    ],
    exports: [
        LoginComponent
    ],
    bootstrap: [LoginComponent], imports: [BrowserModule,
        AppRoutingModule,
        MatToolbarModule,
        MatButtonModule,
        FlexLayoutModule,
        HomeModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatDividerModule,
        MatProgressBarModule], providers: [
        provideAnimationsAsync(),
        CookieService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class LoginModule { }
