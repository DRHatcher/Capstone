import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReservedTimesComponent } from './home/reserved-times/reserved-times.component';
import { CsvuploadComponent } from './home/csvupload/csvupload.component';


const routes: Routes = [
  {
    path: '',
   pathMatch: 'full',
    redirectTo: 'home'
 },
   {
    path: 'home',
     component: HomeComponent,
  },
  {
    path: 'reserved-times',
    component: ReservedTimesComponent, 
  },
  {
    path: 'csv-upload',
    component: CsvuploadComponent, 
  }
];



@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
