import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map } from 'rxjs/operators';

const url = 'https://nn608r3gr4.execute-api.us-east-2.amazonaws.com/default'


interface Course {
  departmentId: string;
  courseNumber: string;
  courseTitle: string;
  sectionNumber?: string;
  instructor?: string;
  days1?: string;
  startTime1?: string;
  endTime1?: string;
  days2?: string;
  startTime2?: string;
  endTime2?: string;
  UUID?: string;
}

@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(
    public http: HttpClient,
    private cookieService: CookieService
    
  ) { }

  login(email: string, password: string) {
    return <Observable<any>>this.http
    .get(`${url}/LogIn?userEmail=${email}&password=${password}`);

    // return <Observable<any>>this.http.get(`./default/LogIn?userEmail=${email}&password=${password}`);
  }

  storeUserEmail(email: string): void {
    this.cookieService.set('userEmail', email, { path: '/', secure: true });
  }


  getUserEmail(): string | null {
    return this.cookieService.get('userEmail') || null;
  }

  
  register(registration: any) {
    return <Observable<any>>this.http.post(`${url}/sspRegistration`, registration);
    // return <Observable<any>>this.http.post('./api/sspRegistration', registration);
  }

  approveReject(request: any, action: string) {
    // return <Observable<any>>this.http.put(`./api/sspRegistration?requestersEmail=${request.requestersEmail}&action=${action}`, request);  }
    return <Observable<any>>this.http.put(`${url}/sspRegistration?requestersEmail=${request.requestersEmail}&action=${action}`, request);  
  }


  getApprovalRequests() {
    return <Observable<any>>this.http.get(`${url}/sspRegistration`);
    // return <Observable<any>>this.http.get('./api/sspRegistration');
  }
  
  getReservedTimes(userEmail: string): Observable<{ days: any[] }> {
    return this.http.get<{ days: any[] }>(`${url}/ReservedTimes?userEmail=${userEmail}`);
  }

  getAllUserReservedTimes(): Observable<{ userEmails: string[] }> {
    return this.http.get<{ userEmails: string[] }>(`${url}/ReservedTimes`);
  }
  
  

  updateReservedTimes(payload: any): Observable<any> {
    return this.http.put<any>(`${url}/ReservedTimes`, payload);
  }

  addNewReservedTimes(payload: any): Observable<any> {
    return this.http.post<any>(`${url}/ReservedTimes`, payload);
  }

  deleteAllReservedTimes(userEmail: string): Observable<any> {
    const apiUrl = `${url}/ReservedTimes?userEmail=${encodeURIComponent(userEmail)}`;
    return this.http.delete(apiUrl);
  }
  
  // Upload courses CSV file
  uploadCourses(formData: FormData): Observable<any> {
    return this.http.post(`${url}/HandleCSV`, formData);
  }

  getCourses(): Observable<any> {
    return this.http.get<any>(`${url}/CRUDCourses`);
  }
  
  submitCourses(payload: { userEmail: string; selectedCourses: Course[] }): Observable<any> {
    console.log('Submitting request to:', `${url}/Schedules`);

    return this.http.post<any>(`${url}/Schedules`, payload);
}

  
  addNewCourse(course: any) {
    return this.http.put(`${url}/CRUDCourses`, course);
  }

  updateCourse(payload: any) {
    console.log('Sending payload to backend:', payload); // Debugging log
    return this.http.post(`${url}/CRUDCourses`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  

  deleteCourse(course: any) {
    return this.http.request('delete',`${url}/CRUDCourses`, {
      body: { UUID: course.UUID }, // Send UUID to delete
    });
  }
  
  saveSchedule(payload: any): Observable<any> {
    return this.http.put(`${url}/Schedules`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  getSavedSchedule(userEmail: string) {
    const apiUrl = `${url}/Schedules?userEmail=${encodeURIComponent(userEmail)}`;
    return this.http.get<any>(apiUrl).pipe(
      map((response) => {
        // Check if the response has the expected format
        if (response?.schedule) {
          return response.schedule; // Return just the schedule array
        } else {
          console.warn('No schedule data found in the response.');
          return null;
        }
      }),
      catchError((error) => {
        console.error('Error fetching saved schedule:', error);
        return throwError(() => new Error('Failed to load saved schedule.'));
      })
    );
  }
  
  getAllUserSchedules(): Observable<any[]> {
    return this.http.get<any[]>(`${url}/Schedules`);
  }
  
  
  deleteSchedule(userEmail: string) {
    const apiUrl = `${url}/Schedules?userEmail=${encodeURIComponent(userEmail)}`;
    return this.http.delete(apiUrl).pipe(
      catchError((error) => {
        console.error('Error deleting schedule:', error);
        return throwError(() => new Error('Failed to delete schedule.'));
      })
    );
  }
  
  
}
