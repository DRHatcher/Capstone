import { Component } from '@angular/core';
import { APIService } from '../../api-service.service';

@Component({
    selector: 'app-csvupload',
    templateUrl: './csvupload.component.html',
    styleUrls: ['./csvupload.component.scss'],
    standalone: false
})
export class CsvuploadComponent {
  csvFile: File | null = null;
  uploadMessage: string = ''; 

  constructor(
    public apiService: APIService
  ) 
  {}

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.csvFile = input.files[0];
    }
  }


  uploadCSV(): void {
    if (this.csvFile) {
      const formData = new FormData();
      formData.append('file', this.csvFile, this.csvFile.name);

      this.apiService.uploadCourses(formData).subscribe(
        (response) => {
          this.uploadMessage = 'File uploaded successfully!';
          console.log('Response:', response);
        },
        (error) => {
          this.uploadMessage = 'Failed to upload file. Please try again.';
          console.error('Upload Error:', error);
        }
      );
    } else {
      this.uploadMessage = 'No file selected!';
    }
  }
}
