import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ApprovalRequestsComponent } from './approval-requests/approval-requests.component';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeRoutingModule } from './home-routing.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { CoursesComponent } from './courses/courses.component';
import { CsvuploadComponent } from './csvupload/csvupload.component';
import { ReservedTimesComponent } from './reserved-times/reserved-times.component';
import { FormsModule } from '@angular/forms';
import { CourseEditDialogComponent } from '../course-edit-dialog/course-edit-dialog.component';
import { SchedulesComponent } from './schedules/schedules.component';

@NgModule({
  declarations: [
    HomeComponent,
    ApprovalRequestsComponent,
    CoursesComponent,
    CsvuploadComponent,
    ReservedTimesComponent,
    CourseEditDialogComponent,
    SchedulesComponent
  ],
  imports: [
    MatIconModule,
    MatSidenavModule,
    MatIconModule,
    MatInputModule,
    MatSidenavModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatButtonModule,
    CommonModule,
    MatProgressBarModule,
    FlexLayoutModule,
    HomeRoutingModule,
    MatDividerModule,
    MatListModule,
    FormsModule,


  ],
  providers: [
  ],
})
export class HomeModule { }
