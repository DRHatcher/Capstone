import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { APIService } from '../../api-service.service';
import { LoginService } from '../../login.service';
import { ChangeDetectorRef } from '@angular/core';
import { CourseEditDialogComponent } from '../../course-edit-dialog/course-edit-dialog.component';
import { Router } from '@angular/router';



export interface Course {
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

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  standalone: false,
})
export class CoursesComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<Course>;
  selectedCourses: Course[] = [];
  loading = true;
  userRole: string | null = null;
  userEmail: string | null = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public apiService: APIService,
    public snackBar: MatSnackBar,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.userRole = this.loginService.userRole;
    this.userEmail = this.loginService.userEmail;

    console.log('User role:', this.userRole);
    console.log('User email:', this.userEmail);

    if (this.userRole === 'STUDENT') {
      this.displayedColumns = ['departmentId', 'courseNumber', 'courseTitle', 'actions'];
    } else if (this.userRole === 'ADMIN' || this.userRole === 'ROOT') {
      this.displayedColumns = [
        'departmentId',
        'courseNumber',
        'courseTitle',
        'sectionNumber',
        'instructor',
        'days1',
        'startTime1',
        'endTime1',
        'actions',
      ];
    }
    console.log('Displayed Columns:', this.displayedColumns);
    this.getCourses();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getCourses() {
    this.loading = true;
    this.apiService.getCourses().subscribe(
      (response) => {
        console.log('API Response:', response); // Check if UUID is included
        const courses = response.courses || [];
        if (this.userRole === 'STUDENT') {
          const uniqueCourses = this.filterUniqueCourses(courses);
          this.dataSource.data = uniqueCourses;
        } else if (this.userRole === 'ADMIN' || this.userRole === 'ROOT') {
          this.dataSource.data = courses; // No filtering for ADMIN/ROOT
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching courses:', error);
        this.snackBar.open('Error fetching courses', 'Close', {
          duration: 3000,
        });
        this.loading = false;
      }
    );
  }
  

  filterUniqueCourses(courses: any[]): Course[] {
    const unique = new Map<string, Course>();
    for (const course of courses) {
      const key = `${course.departmentId}-${course.courseNumber}-${course.courseTitle}`;
      if (!unique.has(key)) {
        unique.set(key, {
          departmentId: course.departmentId,
          courseNumber: course.courseNumber,
          courseTitle: course.courseTitle,
        });
      }
    }
    return Array.from(unique.values());
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addCourse(course: Course) {
    if (this.selectedCourses.length >= 5) {
      this.snackBar.open('You can only select up to 5 courses.', 'Close', {
        duration: 3000,
      });
      return;
    }

    const exists = this.selectedCourses.find(
      (c) =>
        c.departmentId === course.departmentId &&
        c.courseNumber === course.courseNumber &&
        c.courseTitle === course.courseTitle
    );

    if (exists) {
      this.snackBar.open('This course is already selected.', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.selectedCourses.push(course);
    this.cdr.detectChanges();
  }

  removeCourse(course: Course) {
    this.selectedCourses = this.selectedCourses.filter(
      (c) =>
        !(
          c.departmentId === course.departmentId &&
          c.courseNumber === course.courseNumber &&
          c.courseTitle === course.courseTitle
        )
    );
  }

  isSelected(course: Course): boolean {
    return this.selectedCourses.some(
      (c) =>
        c.departmentId === course.departmentId &&
        c.courseNumber === course.courseNumber &&
        c.courseTitle === course.courseTitle
    );
  }

  submitSelectedCourses() {
    if (!this.userEmail) {
      this.snackBar.open('Error: User email is missing.', 'Close', {
        duration: 3000,
      });
      return;
    }
  
    const payload = {
      userEmail: this.userEmail,
      selectedCourses: this.selectedCourses,
    };
  
    console.log('Submitting selected courses:', payload);
  
    this.apiService.submitCourses(payload).subscribe(
      (response) => {
        console.log('Schedules received from API:', response.schedules);
  
        if (!response.schedules || response.schedules.length === 0) {
          this.snackBar.open('No schedules generated.', 'Close', {
            duration: 3000,
          });
          return;
        }
  
        // Navigate to SchedulesComponent and pass schedules
        this.router.navigate(['/home/schedules'], { state: { schedules: response.schedules } });
      },
      (error) => {
        console.error('Error generating schedules:', error);
        this.snackBar.open('Error generating schedules.', 'Close', {
          duration: 3000,
        });
      }
    );
  }
  
  

  addNewCourse(): void {
    const dialogRef = this.dialog.open(CourseEditDialogComponent, {
      width: '500px',
      data: { isEdit: false, courseData: null }, // Pass `isEdit` as false and empty course data
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('New course data:', result);
  
        this.apiService.addNewCourse(result).subscribe(
          () => {
            this.snackBar.open('Course added successfully!', 'Close', {
              duration: 3000,
            });
            this.getCourses(); // Refresh the table
          },
          (error) => {
            console.error('Error adding course:', error);
            this.snackBar.open('Error adding course.', 'Close', {
              duration: 3000,
            });
          }
        );
      }
    });
  }


  editCourse(course: Course) {
    console.log('Editing course:', course);
  
    const dialogRef = this.dialog.open(CourseEditDialogComponent, {
      width: '500px',
      data: { isEdit: true, courseData: course }, // Pass `isEdit` as true and existing course data
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Edited course data:', result);
  
        // Remove empty or undefined fields
        const filteredResult = Object.fromEntries(
          Object.entries(result).filter(([_, value]) => value !== undefined && value !== null)
        );
        console.log('Filtered result:', filteredResult);
  
        // Ensure there are fields to update besides UUID
        if (Object.keys(filteredResult).length <= 1) {
          this.snackBar.open('No fields to update. Please modify at least one field.', 'Close', {
            duration: 3000,
          });
          return;
        }
  
        const payload = {
          operation: 'UPDATE',
          courseData: filteredResult, // Use the filtered keys
        };
  
        console.log('Payload being sent:', payload);
  
        this.apiService.updateCourse(payload).subscribe(
          () => {
            this.snackBar.open('Course updated successfully!', 'Close', {
              duration: 3000,
            });
            this.getCourses(); // Refresh the table
          },
          (error) => {
            console.error('Error updating course:', error);
            this.snackBar.open('Error updating course.', 'Close', {
              duration: 3000,
            });
          }
        );
      } else {
        console.log('Edit dialog was closed without saving changes.');
      }
    });
  }
  
  
  
  

  

  deleteCourse(course: Course) {
    console.log('Course to delete:', course); // Add this to debug
    const confirmed = confirm(
      `Are you sure you want to delete the course "${course.courseTitle}"?`
    );
    if (confirmed) {
      this.apiService.deleteCourse(course).subscribe(
        () => {
          this.snackBar.open('Course deleted successfully!', 'Close', {
            duration: 3000,
          });
          this.getCourses(); // Refresh the table
        },
        (error) => {
          console.error('Error deleting course:', error); // Add this to debug
          this.snackBar.open('Error deleting course.', 'Close', {
            duration: 3000,
          });
        }
      );
    }
  }
  
}
