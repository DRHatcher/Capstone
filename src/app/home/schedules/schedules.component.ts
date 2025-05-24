import { Component, OnInit } from '@angular/core';
import { APIService } from '../../api-service.service';
import { Router } from '@angular/router';
import { LoginService } from '../../login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
  standalone: false,
})
export class SchedulesComponent implements OnInit {
  userRole: string | null = null;
  userEmail: string | null = null;

  schedules: any[] = [];
  savedSchedule: any | null = null;
  allUserSchedules: any[] = []; // List of all users with saved schedules
  adminViewSchedule: any | null = null; // The schedule being viewed by ADMIN/ROOT

  constructor(
    private apiService: APIService,
    private router: Router,
    private loginService: LoginService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.userRole = this.loginService.userRole;
    this.userEmail = this.loginService.userEmail;
  
    if (!this.userEmail) {
      console.error('User email is missing. Redirecting to login.');
      this.router.navigate(['/login']);
      return;
    }
  
    if (this.userRole === 'ADMIN' || this.userRole === 'ROOT') {
      this.loadAllUserSchedules();
    }
  
    // Ensure loadSavedSchedule completes before calling loadGeneratedSchedules
    await this.loadSavedSchedule(); 
    this.loadGeneratedSchedules(); 
  }
  

  /**
   * Load the saved schedule from the database
   */
  async loadSavedSchedule() {
    if (!this.userEmail) {
      console.error('User email is missing.');
      this.router.navigate(['/login']);
      return;
    }

    try {
      const data = await this.apiService.getSavedSchedule(this.userEmail).toPromise();
      if (data) {
        this.savedSchedule = data;
        this.showSnackBar('Loaded saved schedule successfully!', 'OK');
        console.log('Loaded saved schedule:', this.savedSchedule);
      } else {
        console.log('No saved schedule found.');
      }
    } catch (err) {
      const error = err as any;
      console.error('Error loading saved schedule:', error?.message || error);
      this.showSnackBar('Failed to load saved schedule.', 'DISMISS');
    }
  }

  loadGeneratedSchedules() {
    console.log('Checking for saved schedule before generating schedules:', this.savedSchedule);

    if (this.savedSchedule && Array.isArray(this.savedSchedule) && this.savedSchedule.length > 0) {
      this.showSnackBar('You already have a saved schedule. Delete it to generate new schedules.', 'DISMISS');
      return; 
  } else if (Array.isArray(this.savedSchedule) && this.savedSchedule.length === 0) {
      console.warn('Empty saved schedule found, allowing new schedules to be generated.');
  }
  

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['schedules']) {
      this.schedules = navigation.extras.state['schedules'];
      this.showSnackBar('Generated schedules loaded successfully!', 'OK');
      console.log('Schedules received from navigation state:', this.schedules);
    } else if (history.state.schedules) {
      this.schedules = history.state.schedules;
      this.showSnackBar('Generated schedules loaded successfully!', 'OK');
      console.log('Schedules received from history.state:', this.schedules);
    } else {
      console.warn('No schedules found. Redirecting to courses page.');
      this.router.navigate(['/courses']);
    }
  }

  /**
   * Save a selected schedule to the database
   */
  saveSchedule(schedule: any) {
    const payload = {
      userEmail: this.userEmail,
      schedule,
    };

    if (!payload.userEmail || !payload.schedule) {
      this.showSnackBar('User email or schedule is missing. Cannot save schedule.', 'DISMISS');
      return;
    }

    this.apiService.saveSchedule(payload).subscribe(
      () => {
        this.showSnackBar('Schedule saved successfully!', 'OK');
        this.savedSchedule = schedule;
        this.schedules = [];
      },
      (err) => {
        const error = err as any;
        console.error('Error saving schedule:', error?.message || error);
        this.showSnackBar('Failed to save schedule.', 'DISMISS');
      }
    );
  }

  /**
   * Delete the saved schedule from the database
   */
/**
 * Delete the saved schedule from the database
 */
deleteSchedule(userEmail: string | null = null) {
  // Use the provided userEmail or default to the currently logged-in userEmail
  const emailToDelete = userEmail || this.userEmail;

  if (!emailToDelete) {
    this.showSnackBar('User email is missing. Cannot delete schedule.', 'DISMISS');
    return;
  }

  this.apiService.deleteSchedule(emailToDelete).subscribe(
    () => {
      this.showSnackBar('Schedule deleted successfully!', 'OK');

      // For ADMIN/ROOT, clear the viewed schedule and refresh user list
      if (this.userRole === 'ADMIN' || this.userRole === 'ROOT') {
        if (emailToDelete === this.userEmailForView) {
          this.adminViewSchedule = null; // Clear the viewed schedule
          this.userEmailForView = null; // Clear the userEmail for view
        }
        this.loadAllUserSchedules(); // Refresh the list of users with schedules
      } else {
        // For STUDENT, clear saved schedule and redirect
        this.savedSchedule = null;
        this.router.navigate(['/home/courses']);
      }
    },
    (err) => {
      const error = err as any;
      console.error('Error deleting schedule:', error?.message || error);
      this.showSnackBar('Failed to delete schedule.', 'DISMISS');
    }
  );
}



  /**
   * ADMIN/ROOT-specific functionality
   * Load the user emails of all users who have saved schedules
   */
  loadAllUserSchedules() {
    this.apiService.getAllUserSchedules().subscribe(
      (data) => {
        this.allUserSchedules = data;
        console.log('All user schedules loaded successfully:', this.allUserSchedules);
      },
      (err) => {
        console.error('Error loading all user schedules:', err);
        this.showSnackBar('Failed to load user schedules.', 'DISMISS');
      }
    );
  }

  /**
   * View a specific user's schedule
   */

userEmailForView: string | null = null;

viewUserSchedule(userEmail: string) {
  this.userEmailForView = userEmail; 
  this.apiService.getSavedSchedule(userEmail).subscribe(
    (schedule) => {
      this.adminViewSchedule = schedule;
    },
    (err) => {
      console.error('Error loading user schedule:', err);
      this.showSnackBar('Failed to load user schedule.', 'DISMISS');
    }
  );
}

  /**
   * Show a snack bar notification
   */
  showSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
