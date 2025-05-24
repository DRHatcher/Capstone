import { Component, OnInit } from '@angular/core';
import { APIService } from '../../api-service.service';
import { LoginService } from '../../login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: false,
  selector: 'app-reserved-times',
  templateUrl: './reserved-times.component.html',
  styleUrls: ['./reserved-times.component.scss'],
})
export class ReservedTimesComponent implements OnInit {
  userRole: string | null = null;
  userEmail: string | null = null;
  reservedTimes: Array<{
    dayOfWeek: string;
    timeBlocks: Array<{ startTime: string; endTime: string }>;
  }> = [];
  allUserEmails: string[] = [];
  viewedUserReservedTimes: Array<{
    dayOfWeek: string;
    timeBlocks: Array<{ startTime: string; endTime: string }>;
  }> = [];
  viewedUserEmail: string | null = null;

  newTime: { dayOfWeek: string; startTime: string; endTime: string } = {
    dayOfWeek: '',
    startTime: '',
    endTime: '',
  };

  defaultDays = [
    { dayOfWeek: 'Monday', timeBlocks: [] },
    { dayOfWeek: 'Tuesday', timeBlocks: [] },
    { dayOfWeek: 'Wednesday', timeBlocks: [] },
    { dayOfWeek: 'Thursday', timeBlocks: [] },
    { dayOfWeek: 'Friday', timeBlocks: [] },
  ];

  weekdays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  constructor(
    private apiService: APIService, 
    private loginService: LoginService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userRole = this.loginService.userRole;
    this.userEmail = this.loginService.userEmail;
  
    // Debugging logs
    console.log('User role:', this.userRole);
    console.log('User email:', this.userEmail);
  
    if (this.userRole === 'STUDENT' && this.userEmail) {
      console.log('Fetching reserved times for student...');
      this.fetchReservedTimes(); // Fetch reserved times for the student
    } else if (this.userRole === 'ADMIN' || this.userRole === 'ROOT') {
      console.log('Fetching all users for admin/root...');
      this.viewedUserReservedTimes = [...this.defaultDays]; // Initialize cards with default days
      this.fetchAllUserEmails(); // Fetch the list of users with reserved times
    }
  }
  
  

  fetchReservedTimes(): void {
    // Fetch reserved times for the logged-in user
    this.apiService.getReservedTimes(this.userEmail!).subscribe(
      (response) => {
        console.log('API Response:', response); // Debugging: Log raw API response
        this.handleReservedTimesResponse(response);
      },
      (error) => {
        console.error('Error fetching reserved times:', error); // Debugging: Log error
        this.handleReservedTimesError(error);
      }
    );
  }
  
  handleReservedTimesResponse(response: any): void {
    console.log('Raw reserved times response:', response);
  
    const days = response?.days || {}; // Handle potential nesting or undefined
  
    const fetchedDays = Object.keys(days).map((key) => ({
      dayOfWeek: key,
      timeBlocks: days[key] || [], // Ensure timeBlocks is always an array
    }));
  
    console.log('Mapped reserved times:', fetchedDays);
  
    this.reservedTimes = this.defaultDays.map((defaultDay) => {
      const matchingDay = fetchedDays.find(
        (day) => day.dayOfWeek === defaultDay.dayOfWeek
      );
      return matchingDay || defaultDay; // Use fetched data or default structure
    });
  
    console.log('Final reservedTimes:', this.reservedTimes);
  }
  
  
  
  handleReservedTimesError(error: any): void {
    console.error('Error fetching reserved times:', error);
    this.snackBar.open('Failed to fetch reserved times. Using defaults.', 'Close', { duration: 3000 });
    this.reservedTimes = [...this.defaultDays];
  }
  
  
  

  addReservedTime(): void {
    const formattedStartTime = this.newTime.startTime.replace(':', '').replace(/^0+/, '');
    const formattedEndTime = this.newTime.endTime.replace(':', '').replace(/^0+/, '');

    const newTimeBlock = { startTime: formattedStartTime, endTime: formattedEndTime };

    const day = this.reservedTimes.find((d) => d.dayOfWeek === this.newTime.dayOfWeek);
    day?.timeBlocks.push(newTimeBlock);

    const payload = {
      userEmail: this.userEmail,
      days: this.reservedTimes.map((day) => ({
        dayOfWeek: day.dayOfWeek,
        timeBlocks: day.timeBlocks,
      })),
    };

    this.apiService.updateReservedTimes(payload).subscribe(() => {
      this.fetchReservedTimes();
    });
  }

  deleteTimeBlock(dayOfWeek: string, index: number): void {
    const day = this.reservedTimes.find((d) => d.dayOfWeek === dayOfWeek);
    day?.timeBlocks.splice(index, 1);

    const payload = {
      userEmail: this.userEmail,
      days: this.reservedTimes.map((d) => ({ dayOfWeek: d.dayOfWeek, timeBlocks: d.timeBlocks })),
    };

    this.apiService.updateReservedTimes(payload).subscribe(() => {
      this.fetchReservedTimes();
    });
  }

  deleteAllReservedTimes(): void {
    // Determine the target email to delete reserved times for
    const emailToDelete = this.userRole === 'ADMIN' || this.userRole === 'ROOT' ? this.viewedUserEmail : this.userEmail;
  
    if (!emailToDelete) {
      console.error('No user email provided for deletion.');
      return;
    }
  
    // Call the API to delete all reserved times
    this.apiService.deleteAllReservedTimes(emailToDelete).subscribe(
      () => {
        // Refresh the cards
        if (this.userRole === 'ADMIN' || this.userRole === 'ROOT') {
          // Admin/Root: Reset viewed user's reserved times and refresh the table
          this.viewedUserReservedTimes = [...this.defaultDays];
          this.viewedUserEmail = null; // Optionally, clear the viewed user
          this.fetchAllUserEmails(); // Refresh the table
        } else {
          // Student: Reset their reserved times
          this.reservedTimes = [...this.defaultDays];
        }
  
        this.snackBar.open('All reserved times deleted successfully.', 'Close', { duration: 3000 });
      },
      (error) => {
        console.error('Error deleting reserved times:', error);
        this.snackBar.open('Failed to delete reserved times. Please try again.', 'Close', { duration: 3000 });
      }
    );
  }
  
  

  fetchAllUserEmails(): void {
    this.apiService.getAllUserReservedTimes().subscribe(
      (response) => {
        this.allUserEmails = response.userEmails || []; // Update the list of users
      },
      (error) => {
        console.error('Error fetching user emails:', error);
        this.allUserEmails = []; // Clear the table on error
      }
    );
  }
  
  


  viewUserReservedTimes(userEmail: string): void {
    this.apiService.getReservedTimes(userEmail).subscribe(
      (response: any) => {
        const days = response.days || {};
  
        const fetchedDays = Object.keys(days).map((dayOfWeek) => ({
          dayOfWeek,
          timeBlocks: days[dayOfWeek],
        }));
  
        this.viewedUserEmail = userEmail;
  
        this.viewedUserReservedTimes = this.defaultDays.map((defaultDay) => {
          const matchingDay = fetchedDays.find(
            (day) => day.dayOfWeek === defaultDay.dayOfWeek
          );
          return matchingDay || defaultDay;
        });
      },
      (error) => {
        console.error('Error fetching reserved times:', error);
        this.viewedUserReservedTimes = [...this.defaultDays];
      }
    );
  }
  
  
  
  

  handleViewedUserReservedTimesResponse(response: any): void {
    const fetchedDays = Object.keys(response).map((key) => ({
      dayOfWeek: key,
      timeBlocks: response[key],
    }));

    this.viewedUserReservedTimes = this.defaultDays.map((defaultDay) => {
      const matchingDay = fetchedDays.find((day) => day.dayOfWeek === defaultDay.dayOfWeek);
      return matchingDay || defaultDay;
    });
  }
}
