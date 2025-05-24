import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-course-edit-dialog',
  templateUrl: './course-edit-dialog.component.html',
  styleUrls: ['./course-edit-dialog.component.scss'],
  standalone: false
})
export class CourseEditDialogComponent {
  isEdit: boolean; // Determine if this is an edit operation
  dialogTitle: string;

  constructor(
    public dialogRef: MatDialogRef<CourseEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Data passed from parent
  ) {
    this.isEdit = !!data.isEdit; // Check if `isEdit` is true
    this.dialogTitle = this.isEdit ? 'Edit Course' : 'Add Course';

    // Initialize courseData
    this.data.courseData = {
      DepartmentID: data.courseData?.DepartmentID || '',
      'Course#': data.courseData?.['Course#'] || '',
      CourseTitle: data.courseData?.CourseTitle || '',
      'Sec#': data.courseData?.['Sec#'] || '',
      Instructor: data.courseData?.Instructor || '',
      Days1: data.courseData?.Days1 || '',
      StartTime1: data.courseData?.StartTime1 || '',
      EndTime1: data.courseData?.EndTime1 || '',
      Days2: data.courseData?.Days2 || '',
      StartTime2: data.courseData?.StartTime2 || '',
      EndTime2: data.courseData?.EndTime2 || '',
      UUID: data.courseData?.UUID || null // Include UUID if it's an edit operation
    };
  }

  // Format time for display in the input field
  formatToInputTime(time: string | null | undefined): string {
    if (time && time.length === 4) {
      return `${time.slice(0, 2)}:${time.slice(2)}`; // Convert "HHmm" to "HH:mm"
    }
    return time || ''; // Return an empty string if null or undefined
  }

  // Handle input events safely
  onTimeInput(event: Event, field: string): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.value) {
      this.data.courseData[field] = inputElement.value.replace(/:/g, ''); // Remove colons
    }
  }
  

  onCancel(): void {
    this.dialogRef.close(); // Close dialog without saving
  }

  onSave(): void {
    console.log('Data saved:', this.data.courseData); // Log courseData to verify updates
    this.dialogRef.close(this.data.courseData); // Return courseData directly
  }
}
