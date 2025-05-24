import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ApprovalRequestsComponent } from './approval-requests/approval-requests.component';
import { CoursesComponent } from './courses/courses.component';
import { CsvuploadComponent } from './csvupload/csvupload.component';
import { ReservedTimesComponent } from './reserved-times/reserved-times.component'; 
import { SchedulesComponent } from './schedules/schedules.component';
const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'courses'
      },
      {
        path: 'courses',
        component: CoursesComponent
      },
      {
        path: 'approvals',
        component: ApprovalRequestsComponent
      },
      {
        path: 'csvupload',
        component: CsvuploadComponent 
      },
      {
        path: 'reserved-times',
        component: ReservedTimesComponent
      },
      {
        path: 'schedules',
        component: SchedulesComponent
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
